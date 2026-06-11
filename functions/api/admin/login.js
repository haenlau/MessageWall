// POST /api/admin/login - 管理员登录验证
// 从环境变量读取 ADMIN_USER 和 ADMIN_PASS

export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const body = await request.json();
        const { username, password } = body;

        const adminUser = env.ADMIN_USER;
        const adminPass = env.ADMIN_PASS;

        if (!adminUser || !adminPass) {
            return new Response(JSON.stringify({
                success: false,
                error: '管理员功能未配置'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (username === adminUser && password === adminPass) {
            // 生成简单的 admin token（基于密码的 hash）
            const token = await generateAdminToken(adminPass);
            return new Response(JSON.stringify({
                success: true,
                token,
                message: '登录成功'
            }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        return new Response(JSON.stringify({
            success: false,
            error: '账号或密码错误'
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: '登录失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// 验证 admin token（供其他端点调用）
export async function verifyAdminToken(env, token) {
    if (!token || !env.ADMIN_PASS) return false;
    const expected = await generateAdminToken(env.ADMIN_PASS);
    return token === expected;
}

// 使用 Web Crypto API 生成 token
async function generateAdminToken(password) {
    const data = new TextEncoder().encode('guestbook_admin_' + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
