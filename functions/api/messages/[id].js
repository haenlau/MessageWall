// DELETE /api/messages/:id - 删除留言（支持本人删除或管理员删除）

export async function onRequestDelete(context) {
    const { env, params, request } = context;
    const messageId = params.id;

    try {
        const body = await request.json();
        const { session_id, admin_token } = body;

        if (!session_id && !admin_token) {
            return new Response(JSON.stringify({ success: false, error: '缺少会话标识' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { results } = await env.DB.prepare(
            "SELECT id, session_id FROM messages WHERE id = ?"
        ).bind(messageId).all();

        if (results.length === 0) {
            return new Response(JSON.stringify({ success: false, error: '留言不存在' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const isOwner = results[0].session_id === session_id;
        const isAdmin = admin_token ? await verifyAdminToken(env, admin_token) : false;

        if (!isOwner && !isAdmin) {
            return new Response(JSON.stringify({ success: false, error: '只能删除自己的留言' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 删除关联数据
        await env.DB.prepare("DELETE FROM likes WHERE message_id = ?").bind(messageId).run();
        await env.DB.prepare("DELETE FROM reactions WHERE message_id = ?").bind(messageId).run();
        await env.DB.prepare("DELETE FROM messages WHERE id = ?").bind(messageId).run();

        return new Response(JSON.stringify({ success: true, message: '留言已删除' }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: '删除失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// 验证 admin token
async function verifyAdminToken(env, token) {
    if (!token || !env.ADMIN_PASS) return false;
    const data = new TextEncoder().encode('guestbook_admin_' + env.ADMIN_PASS);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expected = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return token === expected;
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
