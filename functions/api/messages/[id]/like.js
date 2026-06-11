// POST /api/messages/:id/like - 点赞/取消点赞

export async function onRequestPost(context) {
    const { env, params, request } = context;
    const messageId = params.id;

    try {
        const body = await request.json();
        const { session_id } = body;

        if (!session_id) {
            return new Response(JSON.stringify({ success: false, error: '缺少会话标识' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 检查是否已点赞
        const { results: existing } = await env.DB.prepare(
            "SELECT id FROM likes WHERE message_id = ? AND session_id = ?"
        ).bind(messageId, session_id).all();

        if (existing.length > 0) {
            // 取消点赞
            await env.DB.prepare(
                "DELETE FROM likes WHERE message_id = ? AND session_id = ?"
            ).bind(messageId, session_id).run();
        } else {
            // 点赞
            await env.DB.prepare(
                "INSERT INTO likes (message_id, session_id) VALUES (?, ?)"
            ).bind(messageId, session_id).run();
        }

        // 获取最新点赞数
        const { results: countResult } = await env.DB.prepare(
            "SELECT COUNT(*) as total FROM likes WHERE message_id = ?"
        ).bind(messageId).all();

        return new Response(JSON.stringify({
            success: true,
            liked: existing.length === 0,
            like_count: countResult[0].total
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
