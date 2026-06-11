-- 迁移测试数据
-- 使用方式：
-- Cloudflare Dashboard → D1 → guestbook-db → Console → 粘贴执行
-- 或 CLI: npx wrangler d1 execute guestbook-db --file=./migrate.sql

INSERT INTO messages (author_name, avatar_seed, content, session_id, created_at)
VALUES
    ('安静的守夜人', '安静的守夜人_test_1', '不必字字斟酌，不用句句完美。开心时的雀跃，低落时的感慨，独处时的碎念，都可以留在这里。愿每一句留言，都能被妥帖安放；愿每一个你，都能找到片刻的共鸣。现在，轮到你啦。', 'migrate_legacy', '2025-12-14 22:30:01'),
    ('犹豫的做梦者', '犹豫的做梦者_test_2', '今天要做个好梦😴', 'migrate_legacy', '2025-12-14 22:51:39');
