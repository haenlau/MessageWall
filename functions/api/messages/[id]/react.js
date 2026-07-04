// POST /api/messages/:id/react - 添加/切换表情反应

const VALID_REACTIONS = ['👍', '❤️', '😂', '😮', '👏', '🔥'];

export async function onRequestPost(context) {
    const { env, params, request } = context;
    const messageId = params.id;

    try {
        const body = await request.json();
        const { session_id, reaction_type } = body;

        if (!session_id || !reaction_type) {
            return new Response(JSON.stringify({ success: false, error: '缺少必要字段' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!VALID_REACTIONS.includes(reaction_type)) {
            return new Response(JSON.stringify({ success: false, error: '无效的表情类型' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 检查是否已有该反应
        const { results: existing } = await env.DB.prepare(
            "SELECT id FROM reactions WHERE message_id = ? AND session_id = ? AND reaction_type = ?"
        ).bind(messageId, session_id, reaction_type).all();

        if (existing.length > 0) {
            // 取消反应
            await env.DB.prepare(
                "DELETE FROM reactions WHERE message_id = ? AND session_id = ? AND reaction_type = ?"
            ).bind(messageId, session_id, reaction_type).run();
        } else {
            // 添加反应
            await env.DB.prepare(
                "INSERT INTO reactions (message_id, session_id, reaction_type) VALUES (?, ?, ?)"
            ).bind(messageId, session_id, reaction_type).run();
        }

        // 获取该留言所有反应统计
        const { results: reactions } = await env.DB.prepare(`
            SELECT reaction_type, COUNT(*) as count,
                   MAX(CASE WHEN session_id = ? THEN 1 ELSE 0 END) as user_reacted
            FROM reactions WHERE message_id = ?
            GROUP BY reaction_type
        `).bind(session_id, messageId).all();

        return new Response(JSON.stringify({
            success: true,
            reactions: reactions.map(r => ({
                type: r.reaction_type,
                count: r.count,
                user_reacted: !!r.user_reacted
            }))
        }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: '操作失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
