// POST /api/visit - 记录访客
// 到访即记录，每人只算一次（基于 session_id）

export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const body = await request.json();
        const { session_id } = body;

        if (!session_id) {
            return new Response(JSON.stringify({ success: false, error: '缺少 session_id' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // INSERT OR IGNORE - 已存在则忽略
        await env.DB.prepare(
            "INSERT OR IGNORE INTO visitors (session_id) VALUES (?)"
        ).bind(session_id).run();

        // 更新 last_visit
        await env.DB.prepare(
            "UPDATE visitors SET last_visit = datetime('now') WHERE session_id = ?"
        ).bind(session_id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: '记录失败' }), {
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
