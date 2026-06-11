-- 迁移旧留言数据到新数据库
-- 使用方式：
-- 方式1 (Cloudflare Dashboard): 复制内容到 D1 Console 执行
-- 方式2 (CLI): npx wrangler d1 execute guestbook-db --file=./migrate.sql

INSERT INTO messages (author_name, avatar_seed, content, session_id, created_at)
VALUES
    ('忘带伞的忘川客', '忘带伞的忘川客_migrate_1', '发发发', 'migrate_legacy', '2026-05-12 08:51:03'),
    ('停驻的点灯人', '停驻的点灯人_migrate_2', '测试一下', 'migrate_legacy', '2026-01-22 17:35:30'),
    ('找钥匙的藏书人', '找钥匙的藏书人_migrate_3', '遗憾无法说，惊觉心一缩', 'migrate_legacy', '2026-01-21 15:37:33'),
    ('捡落叶的做梦者', '捡落叶的做梦者_migrate_4', '开心开心开心🥳', 'migrate_legacy', '2026-01-05 19:28:50'),
    ('惆怅的听风者', '惆怅的听风者_migrate_5', '圣诞老人 我想要永远永远幸福', 'migrate_legacy', '2025-12-26 00:01:28'),
    ('抚琴的流浪者', '抚琴的流浪者_migrate_6', '明天8点45起！', 'migrate_legacy', '2025-12-25 00:20:43'),
    ('忘带伞的忘川客', '忘带伞的忘川客_migrate_7', 'git pull pnpm install', 'migrate_legacy', '2025-12-24 19:57:10'),
    ('惆怅的寻路人', '惆怅的寻路人_migrate_8', '记得醒来跟我说肚子舒不舒服', 'migrate_legacy', '2025-12-24 01:42:07'),
    ('写错字的拾荒者', '写错字的拾荒者_migrate_9', '明天九点起床！', 'migrate_legacy', '2025-12-24 01:10:54'),
    ('迟到的远行人', '迟到的远行人_migrate_10', '明年去看山东的海吧', 'migrate_legacy', '2025-12-21 01:44:44'),
    ('驻足的摘星人', '驻足的摘星人_migrate_11', '好焦虑😭', 'migrate_legacy', '2025-12-19 01:34:42'),
    ('漂泊的做梦者', '漂泊的做梦者_migrate_12', '今天是美好的一天！', 'migrate_legacy', '2025-12-18 19:19:56'),
    ('犹豫的记录者', '犹豫的记录者_migrate_13', '注意集中精力，努力做好一件事', 'migrate_legacy', '2025-12-17 17:32:49'),
    ('匆忙的旅人', '匆忙的旅人_migrate_14', '哥哥我爱你哟🤗', 'migrate_legacy', '2025-12-17 01:05:18'),
    ('犹豫的做梦者', '犹豫的做梦者_migrate_15', '今天要做个好梦😴', 'migrate_legacy', '2025-12-14 22:51:39'),
    ('犹豫的做梦者', '犹豫的做梦者_migrate_16', '耶耶耶', 'migrate_legacy', '2025-12-14 22:49:49'),
    ('犹豫的做梦者', '犹豫的做梦者_migrate_17', '耶耶耶', 'migrate_legacy', '2025-12-14 22:49:46'),
    ('迷路的写作者', '迷路的写作者_migrate_18', '揪咪', 'migrate_legacy', '2025-12-14 22:45:42'),
    ('安静的守夜人', '安静的守夜人_migrate_19', '不必字字斟酌，不用句句完美。 开心时的雀跃，低落时的感慨，独处时的碎念，都可以留在这里。 愿每一句留言，都能被妥帖安放；愿每一个你，都能找到片刻的共鸣。 现在，轮到你啦。', 'migrate_legacy', '2025-12-14 22:30:01');
