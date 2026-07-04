// GET /api/messages - 获取留言列表（含分页、点赞数和反应）
// POST /api/messages - 创建新留言

export async function onRequestGet(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id') || '';
    const search = url.searchParams.get('search') || '';
    const sort = url.searchParams.get('sort') || 'newest';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '5', 10)));
    const offset = (page - 1) * limit;

    try {
        // 构建 WHERE 子句
        let whereClause = '';
        const countParams = [];
        const queryParams = [sessionId];

        if (search) {
            whereClause = ` WHERE m.content LIKE ? OR m.author_name LIKE ?`;
            countParams.push(`%${search}%`, `%${search}%`);
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        // 查询总数
        const countQuery = `SELECT COUNT(*) as total FROM messages m${whereClause}`;
        const { results: countResult } = await env.DB.prepare(countQuery).bind(...countParams).all();
        const totalMessages = countResult[0].total;
        const totalPages = Math.ceil(totalMessages / limit);

        // 查询留言（带分页）
        let query = `
            SELECT 
                m.id, m.author_name, m.avatar_seed, m.content, m.session_id, m.created_at,
                COALESCE(like_counts.total, 0) as like_count,
                CASE WHEN user_likes.id IS NOT NULL THEN 1 ELSE 0 END as user_liked
            FROM messages m
            LEFT JOIN (
                SELECT message_id, COUNT(*) as total 
                FROM likes GROUP BY message_id
            ) like_counts ON m.id = like_counts.message_id
            LEFT JOIN likes user_likes ON m.id = user_likes.message_id AND user_likes.session_id = ?
            ${whereClause}
        `;

        if (sort === 'oldest') {
            query += ` ORDER BY m.created_at ASC`;
        } else if (sort === 'popular') {
            query += ` ORDER BY like_counts.total DESC, m.created_at DESC`;
        } else {
            query += ` ORDER BY m.created_at DESC`;
        }

        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        const { results: messages } = await env.DB.prepare(query).bind(...queryParams).all();

        // 获取每条留言的反应统计
        const messageIds = messages.map(m => m.id);
        let reactionsMap = {};

        if (messageIds.length > 0) {
            const placeholders = messageIds.map(() => '?').join(',');
            const { results: reactions } = await env.DB.prepare(`
                SELECT message_id, reaction_type, COUNT(*) as count,
                       MAX(CASE WHEN session_id = ? THEN 1 ELSE 0 END) as user_reacted
                FROM reactions
                WHERE message_id IN (${placeholders})
                GROUP BY message_id, reaction_type
            `).bind(sessionId, ...messageIds).all();

            for (const r of reactions) {
                if (!reactionsMap[r.message_id]) reactionsMap[r.message_id] = [];
                reactionsMap[r.message_id].push({
                    type: r.reaction_type,
                    count: r.count,
                    user_reacted: !!r.user_reacted
                });
            }
        }

        // 附加反应到留言
        const enriched = messages.map(m => ({
            ...m,
            user_liked: !!m.user_liked,
            reactions: reactionsMap[m.id] || []
        }));

        // 获取统计信息
        const { results: stats } = await env.DB.prepare(
            `SELECT 
                (SELECT COUNT(*) FROM messages) as total_messages,
                (SELECT COUNT(*) FROM visitors) as active_users`
        ).all();

        return new Response(JSON.stringify({
            success: true,
            messages: enriched,
            pagination: {
                page,
                limit,
                total: totalMessages,
                total_pages: totalPages,
                has_next: page < totalPages,
                has_prev: page > 1
            },
            stats: {
                total_messages: stats[0].total_messages,
                active_users: stats[0].active_users
            }
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        console.error('Fetch messages error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: '获取留言失败'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const body = await request.json();
        const { author_name, avatar_seed, content, session_id } = body;

        if (!author_name || !content || !session_id) {
            return new Response(JSON.stringify({
                success: false,
                error: '缺少必要字段'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (author_name.length > 20) {
            return new Response(JSON.stringify({
                success: false,
                error: '名字不能超过20个字符'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (content.length > 500) {
            return new Response(JSON.stringify({
                success: false,
                error: '留言内容不能超过500个字符'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await env.DB.prepare(
            "INSERT INTO messages (author_name, avatar_seed, content, session_id) VALUES (?, ?, ?, ?)"
        ).bind(author_name, avatar_seed || author_name, content, session_id).run();

        const { results } = await env.DB.prepare(
            "SELECT id, author_name, avatar_seed, content, session_id, created_at FROM messages WHERE id = ?"
        ).bind(result.meta.last_row_id).all();

        const message = results[0];
        const notifyTask = sendTelegramNotification(env, {
            content: message.content,
            created_at: message.created_at,
            ip: getClientIp(request)
        });

        if (context.waitUntil) {
            context.waitUntil(notifyTask);
        } else {
            notifyTask.catch(error => console.error('Telegram notification failed:', error));
        }

        return new Response(JSON.stringify({
            success: true,
            message: { ...message, like_count: 0, user_liked: false, reactions: [] }
        }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: '发布留言失败'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

function getClientIp(request) {
    const forwardedFor = request.headers.get('X-Forwarded-For');

    return request.headers.get('CF-Connecting-IP') ||
        request.headers.get('True-Client-IP') ||
        (forwardedFor ? forwardedFor.split(',')[0].trim() : '') ||
        'unknown';
}

function formatMessageTime(createdAt) {
    if (!createdAt) return 'unknown';

    const normalized = createdAt.includes('T') ? createdAt : createdAt.replace(' ', 'T');
    const date = new Date(normalized.endsWith('Z') ? normalized : `${normalized}Z`);
    if (Number.isNaN(date.getTime())) return createdAt;

    return new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);
}

async function sendTelegramNotification(env, message) {
    const token = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) return;

    const text = [
        '收到新留言',
        `时间：${formatMessageTime(message.created_at)}`,
        `IP：${message.ip}`,
        '',
        '留言内容：',
        message.content
    ].join('\n');

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text
            })
        });

        if (!response.ok) {
            console.error('Telegram notification failed:', await response.text());
        }
    } catch (error) {
        console.error('Telegram notification failed:', error);
    }
}
