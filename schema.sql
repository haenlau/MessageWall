-- D1 数据库初始化脚本
-- 运行方式: npx wrangler d1 execute guestbook-db --file=./schema.sql

-- 留言主表
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name TEXT NOT NULL,
    avatar_seed TEXT NOT NULL,
    content TEXT NOT NULL,
    session_id TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- 点赞表（每个用户对每条留言只能点赞一次）
CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    session_id TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now')),
    UNIQUE(message_id, session_id),
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- 表情反应表（每个用户对每条留言每种表情只能反应一次）
CREATE TABLE IF NOT EXISTS reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    session_id TEXT NOT NULL,
    reaction_type TEXT NOT NULL,  -- '👍' '❤️' '😂' '😮' '👏' '🔥'
    created_at DATETIME DEFAULT (datetime('now')),
    UNIQUE(message_id, session_id, reaction_type),
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_likes_message_id ON likes(message_id);
CREATE INDEX IF NOT EXISTS idx_likes_session_id ON likes(session_id);
CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON reactions(message_id);

-- 访客表（记录每个到访用户，用于统计独立访客数）
CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL UNIQUE,
    first_visit DATETIME DEFAULT (datetime('now')),
    last_visit DATETIME DEFAULT (datetime('now'))
);
