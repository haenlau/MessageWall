// GET /api/avatar/:seed - DiceBear 头像代理
// 解决中国大陆无法直接访问 DiceBear 的问题
// 通过 Cloudflare 边缘节点代理请求

export async function onRequestGet(context) {
    const { params } = context;
    const seed = params.seed;

    if (!seed) {
        return new Response('Missing seed', { status: 400 });
    }

    // 从 seed 解析 style（与前端 hashStr 逻辑一致）
    const AV_STYLES = ['lorelei', 'micah', 'notionists', 'open-peeps', 'personas', 'avataaars', 'big-ears', 'fun-emoji', 'thumbs'];
    const style = AV_STYLES[Math.abs(hashStr(seed)) % AV_STYLES.length];

    const dicebearUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&radius=50&size=128`;

    try {
        const response = await fetch(dicebearUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'image/svg+xml'
            },
            cf: {
                cacheTtl: 86400,      // 缓存 24 小时
                cacheEverything: true
            }
        });

        if (!response.ok) {
            return new Response('Avatar fetch failed', { status: 502 });
        }

        const svg = await response.text();

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response('Proxy error', { status: 502 });
    }
}

function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
    return h;
}
