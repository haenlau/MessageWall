# 留声机 · Msg

一个基于 **Material Design 3** 色彩系统的现代化留言板，部署在 **Cloudflare Pages + D1 数据库**。

> 🍃 每一次留言，都是与陌生人的一次温暖相遇

---

## 📸 功能概览

| 功能 | 描述 |
|------|------|
| 🎲 **随机身份** | 20 种形容词 × 20 种名词 = 400 种随机昵称组合 |
| 🎨 **随机头像** | DiceBear API 9 种风格自动生成（lorelei、micah、personas 等） |
| ✏️ **自定义昵称** | 直接输入框修改，支持最多 20 字符 |
| 💬 **留言发布** | 500 字限制，支持 Ctrl+Enter 快捷发布 |
| ❤️ **点赞系统** | 每人每条留言可点赞/取消，实时计数 |
| 😀 **表情反应** | 6 种快速表情：👍 ❤️ 😂 😮 👏 🔥 |
| 🔍 **搜索功能** | 实时搜索留言内容和昵称（350ms 防抖） |
| 📊 **排序选项** | 最新 / 最热 / 最早 三种排序方式 |
| 🌙 **主题切换** | 亮色 / 暗色 / 跟随系统 三态切换 |
| 📄 **分页浏览** | 默认每页 5 条，可选 10 / 30 条 |
| 📈 **数据统计** | 首页卡片实时显示总留言数和访客数 |
| 🔒 **权限控制** | 只能删除自己的留言，无法删除他人留言 |
| 🔑 **管理员** | 管理员可删除任意留言，密码通过环境变量配置 |
| 📱 **响应式设计** | 完美适配手机、平板、桌面端 |
| ⚡ **骨架屏** | 加载时显示优雅的骨架动画 |
| 💬 **确认弹窗** | 删除前弹出 Material 风格确认对话框 |

---

## 🎨 Material Design 3 色彩系统

基于 Google Material Design 3 色彩角色体系，采用自然有机的暖色调：

### 亮色主题

| 色彩角色 | 色值 | 说明 |
|---------|------|------|
| Primary | `#3A6B4C` | 深鼠尾草绿 — 沉稳自然 |
| On Primary | `#FFFFFF` | 主色上的文字 |
| Primary Container | `#BCECC6` | 浅薄荷绿 |
| Secondary | `#9C6D2E` | 暖琥珀色 — 温暖亲切 |
| Secondary Container | `#FFDEA6` | 浅金色 |
| Tertiary | `#8B4A52` | 灰玫瑰色 — 柔和点缀 |
| Tertiary Container | `#FFD9DD` | 浅粉色 |
| Surface | `#FDFBF7` | 暖白色底色 |
| On Surface | `#1C1B18` | 主要文字色 |
| Outline | `#74796D` | 边框和分割线 |

### 暗色主题

自动适配完整的暗色主题，包含：
- 降低亮度的 Primary（`#A1D0AF`）
- 深色 Surface（`#141310`）
- 高对比度的文字色
- 暗色阴影系统

### 设计特点

- **Shape Scale**: 从 4px（xs）到 9999px（full）的圆角体系
- **Elevation**: 3 级阴影系统（低/中/高）
- **Motion**: 标准和强调两种缓动曲线
- **Typography**: Noto Sans SC 字体，清晰的层级关系

---

## 🚀 部署指南

### 方式一：GitHub 自动部署（推荐）

#### 第一步：Fork 或使用本仓库

```
仓库地址: https://github.com/haenlau/guestbook
```

#### 第二步：登录 Cloudflare Dashboard

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧菜单选择 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Pages** 标签
5. 点击 **Connect to Git**

#### 第三步：连接 GitHub 仓库

1. 授权 Cloudflare 访问你的 GitHub 账号
2. 选择 `haenlau/guestbook` 仓库
3. 点击 **Begin setup**

#### 第四步：配置构建设置

```
Project name: guestbook（或自定义名称）
Production branch: main

Build settings:
  Build command: (留空)
  Build output directory: public
```

> ⚠️ **重要**：Build command 留空，不要填写任何内容。本项目是纯静态前端 + Functions，无需构建步骤。

点击 **Save and Deploy**

#### 第五步：创建 D1 数据库

1. 在 Cloudflare Dashboard 左侧菜单选择 **Workers & Pages**
2. 点击你的 Pages 项目
3. 进入 **Settings** → **Functions**
4. 找到 **D1 database bindings** 部分
5. 点击 **Add binding**
6. 填写：
   - Variable name: `DB`
   - D1 database: 点击 **Create** 创建新数据库
   - 数据库名称: `guestbook-db`
7. 点击 **Save**

#### 第六步：初始化数据库表结构

创建数据库后，需要初始化表结构。有两种方式：

**方式 A：在 Cloudflare Dashboard 操作**

1. 进入 **Workers & Pages** → **D1**
2. 选择 `guestbook-db` 数据库
3. 点击 **Console** 标签
4. 复制 `schema.sql` 文件的内容
5. 粘贴到控制台并执行

**方式 B：使用 Wrangler CLI**

```bash
# 安装 wrangler
npm install -g wrangler

# 登录
wrangler login

# 克隆仓库
git clone https://github.com/haenlau/guestbook.git
cd guestbook

# 初始化数据库（需要先在 wrangler.toml 中填入 database_id）
npm run db:init
```

#### 第七步：获取 wrangler.toml 中的 database_id（可选）

如果需要使用 CLI 管理数据库：

1. 在 Cloudflare Dashboard → **Workers & Pages** → **D1**
2. 选择 `guestbook-db`
3. 在右侧详情页找到 **Database ID**
4. 复制并填入 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "guestbook-db"
database_id = "你的数据库ID"  # ← 替换这里
```

#### 完成！

部署完成后，Cloudflare 会分配一个域名，格式为：
```
https://guestbook.pages.dev
```

你也可以在项目设置中绑定自定义域名。

---

### 方式二：命令行部署

```bash
# 1. 克隆仓库
git clone https://github.com/haenlau/guestbook.git
cd guestbook

# 2. 安装 wrangler
npm install -g wrangler

# 3. 登录 Cloudflare
wrangler login

# 4. 创建 D1 数据库
wrangler d1 create guestbook-db
# 记录输出的 database_id

# 5. 更新 wrangler.toml
# 将 database_id 填入配置文件

# 6. 初始化数据库
npm run db:init

# 7. 本地测试
npm run dev
# 访问 http://localhost:8788

# 8. 部署到 Cloudflare Pages
npm run deploy
```

---

## 🗄️ 数据库绑定与环境变量

### D1 数据库绑定

| 绑定名 | 类型 | 说明 |
|--------|------|------|
| `DB` | D1 Database | 存储留言、点赞、反应数据 |

### 环境变量 / 密钥

| 变量名 | 类型 | 说明 |
|--------|------|------|
| `ADMIN_USER` | 环境变量 (文本) | 管理员登录账号 |
| `ADMIN_PASS` | 密钥 (Secret) | 管理员登录密码 |

> ⚠️ **安全建议**：`ADMIN_PASS` 应使用 Wrangler Secret 存储，不要明文写入配置文件。

#### 设置方式

**方式一：Cloudflare Dashboard**
1. 进入 Pages 项目 → **Settings** → **Environment variables**
2. 添加 `ADMIN_USER`（类型选 Variable）
3. 添加 `ADMIN_PASS`（类型选 Secret）

**方式二：Wrangler CLI**
```bash
# 设置账号（普通环境变量）
npx wrangler pages secret put ADMIN_USER

# 设置密码（加密存储）
npx wrangler pages secret put ADMIN_PASS
```

```sql
-- 留言主表
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name TEXT NOT NULL,        -- 昵称（最多20字符）
    avatar_seed TEXT NOT NULL,        -- 头像种子（用于生成随机头像）
    content TEXT NOT NULL,            -- 留言内容（最多500字符）
    session_id TEXT NOT NULL,         -- 会话标识（用于权限控制）
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- 点赞表
CREATE TABLE likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,      -- 关联留言ID
    session_id TEXT NOT NULL,         -- 点赞用户会话ID
    created_at DATETIME DEFAULT (datetime('now')),
    UNIQUE(message_id, session_id),   -- 每人每条留言只能点赞一次
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- 表情反应表
CREATE TABLE reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,      -- 关联留言ID
    session_id TEXT NOT NULL,         -- 反应用户会话ID
    reaction_type TEXT NOT NULL,      -- 表情类型: '👍' '❤️' '😂' '😮' '👏' '🔥'
    created_at DATETIME DEFAULT (datetime('now')),
    UNIQUE(message_id, session_id, reaction_type),  -- 每人每种表情只能反应一次
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);
```

### 索引

```sql
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_likes_message_id ON likes(message_id);
CREATE INDEX idx_likes_session_id ON likes(session_id);
CREATE INDEX idx_reactions_message_id ON reactions(message_id);
```

### 绑定变量

| 绑定名 | 类型 | 说明 |
|--------|------|------|
| `DB` | D1 Database | 存储留言、点赞、反应数据 |

---

## 📡 API 接口文档

### 获取留言列表

```http
GET /api/messages?session_id={sid}&sort={sort}&search={keyword}
```

**参数：**
- `session_id` (string, 可选): 当前用户会话 ID，用于判断是否已点赞/反应
- `sort` (string, 可选): 排序方式 - `newest`(默认) / `oldest` / `popular`
- `search` (string, 可选): 搜索关键词，匹配内容和昵称

**响应：**
```json
{
  "success": true,
  "messages": [
    {
      "id": 1,
      "author_name": "快乐的小猫",
      "avatar_seed": "快乐的小猫_1234567890",
      "content": "留言内容",
      "session_id": "s_xxx",
      "created_at": "2024-01-01 12:00:00",
      "like_count": 5,
      "user_liked": false,
      "reactions": [
        { "type": "👍", "count": 3, "user_reacted": true },
        { "type": "❤️", "count": 2, "user_reacted": false }
      ]
    }
  ],
  "stats": {
    "total_messages": 100,
    "active_users": 42
  }
}
```

### 发布留言

```http
POST /api/messages
Content-Type: application/json

{
  "author_name": "勇敢的小狗",
  "avatar_seed": "勇敢的小狗_1234567890",
  "content": "留言内容",
  "session_id": "s_xxx"
}
```

**验证规则：**
- `author_name`: 必填，最多 20 字符
- `content`: 必填，最多 500 字符
- `session_id`: 必填

**响应：**
```json
{
  "success": true,
  "message": {
    "id": 2,
    "author_name": "勇敢的小狗",
    "content": "留言内容",
    "like_count": 0,
    "user_liked": false,
    "reactions": []
  }
}
```

### 删除留言

```http
DELETE /api/messages/{id}
Content-Type: application/json

{
  "session_id": "s_xxx"
}
```

**权限验证：**
- 只能删除自己发布的留言（session_id 匹配）
- 删除会级联清理关联的点赞和反应

### 点赞/取消点赞

```http
POST /api/messages/{id}/like
Content-Type: application/json

{
  "session_id": "s_xxx"
}
```

**行为：**
- 如果已点赞，则取消点赞
- 如果未点赞，则添加点赞
- 返回最新的点赞状态和计数

**响应：**
```json
{
  "success": true,
  "liked": true,
  "like_count": 6
}
```

### 表情反应

```http
POST /api/messages/{id}/react
Content-Type: application/json

{
  "session_id": "s_xxx",
  "reaction_type": "👍"
}
```

**有效的表情类型：** `👍` `❤️` `😂` `😮` `👏` `🔥`

**行为：**
- 如果已添加该表情，则取消
- 如果未添加，则添加
- 返回该留言所有反应的统计

**响应：**
```json
{
  "success": true,
  "reactions": [
    { "type": "👍", "count": 4, "user_reacted": true },
    { "type": "❤️", "count": 2, "user_reacted": false }
  ]
}
```

### 管理员登录

```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "你的管理员账号",
  "password": "你的管理员密码"
}
```

**验证规则：**
- 账号密码与环境变量 `ADMIN_USER` 和 `ADMIN_PASS` 匹配

**响应（成功）：**
```json
{
  "success": true,
  "token": "sha256_hash_token",
  "message": "登录成功"
}
```

**响应（失败）：**
```json
{
  "success": false,
  "error": "账号或密码错误"
}
```

**说明：**
- 登录成功后返回 `token`，客户端存储在 sessionStorage
- 管理员删除留言时，请求体附带 `admin_token` 字段
- 管理员可以删除任意用户的留言
- 顶栏 👤 按钮点击弹出登录框，登录后变为 🔑，再次点击退出

---

## 📁 项目结构

```
guestbook/
│
├── public/                          # 静态前端文件（Cloudflare Pages 输出目录）
│   └── index.html                   # 主页面（包含完整 UI 和逻辑）
│
├── functions/                       # Cloudflare Functions（API 后端）
│   └── api/
│       ├── messages.js              # GET/POST /api/messages
│       ├── admin/
│       │   └── login.js             # POST /api/admin/login
│       └── messages/
│           ├── [id].js              # DELETE /api/messages/:id（支持管理员删除）
│           └── [id]/
│               ├── like.js          # POST /api/messages/:id/like
│               └── react.js         # POST /api/messages/:id/react
│
├── schema.sql                       # D1 数据库初始化脚本（3 张表 + 5 个索引）
├── migrate.sql                      # 测试数据迁移脚本
├── wrangler.toml                    # Cloudflare Workers 配置
├── package.json                     # 项目配置和 npm 脚本
├── .gitignore                       # Git 忽略文件
└── README.md                        # 本文档
```

---

## 🛠️ 本地开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 启动开发服务器

```bash
# 安装依赖（本项目无外部依赖，此步骤可跳过）
npm install

# 启动本地开发服务器
npm run dev
```

访问 http://localhost:8788 查看效果。

### 本地数据库初始化

```bash
# 初始化本地 D1 数据库
npm run db:init:local
```

### 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动本地开发服务器 |
| `npm run deploy` | 部署到 Cloudflare Pages |
| `npm run db:init` | 初始化远程 D1 数据库 |
| `npm run db:init:local` | 初始化本地 D1 数据库 |

---

## 🎯 自定义指南

### 修改随机名字库

编辑 `public/index.html` 中的 `adj` 和 `noun` 数组：

```javascript
const adj = ['快乐的', '勇敢的', '聪明的', /* 添加更多形容词 */];
const noun = ['小猫', '小狗', '兔子', /* 添加更多名词 */];
```

### 修改头像风格

编辑 `public/index.html` 中的 `AV_STYLES` 数组：

```javascript
const AV_STYLES = ['lorelei', 'micah', 'notionists', 'open-peeps', 'personas', 'avataaars', 'big-ears', 'fun-emoji', 'thumbs'];
```

可选风格参考: https://dicebear.com/styles

### 修改色彩主题

编辑 `public/index.html` 中的 CSS 变量：

```css
:root {
    --md-primary: #3a6b4c;           /* 主色 */
    --md-secondary: #9c6d2e;         /* 辅助色 */
    --md-tertiary: #8b4a52;          /* 点缀色 */
    --md-surface: #fdfbf7;           /* 底色 */
    /* ... 更多变量 */
}
```

### 修改留言限制

1. 修改 `schema.sql` 中的字段类型
2. 修改 `functions/api/messages.js` 中的验证逻辑
3. 修改 `public/index.html` 中的 `maxlength` 属性

### 添加自定义域名

1. 在 Cloudflare Dashboard 进入你的 Pages 项目
2. 点击 **Custom domains** 标签
3. 点击 **Set up a custom domain**
4. 输入你的域名并按提示配置 DNS

---

## 🔧 故障排除

### 数据库连接失败

**症状**: API 返回 500 错误

**解决**:
1. 确认 D1 数据库已创建
2. 确认 Pages 项目已绑定数据库（Settings → Functions → D1 database bindings）
3. 确认 Variable name 为 `DB`（区分大小写）

### 留言发布失败

**症状**: 点击发布按钮无反应或报错

**解决**:
1. 检查浏览器控制台是否有错误
2. 确认昵称不为空且不超过 20 字符
3. 确认留言内容不为空且不超过 500 字符

### 头像不显示

**症状**: 头像区域显示为空白

**解决**:
1. 检查网络连接（头像从 DiceBear CDN 加载）
2. 检查浏览器是否阻止了外部图片加载
3. 尝试点击骰子按钮刷新头像

### 暗色模式不生效

**症状**: 点击主题切换按钮无变化

**解决**:
1. 清除浏览器缓存
2. 检查 localStorage 是否被禁用

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Material Design 3](https://m3.material.io/) — 色彩系统设计规范
- [DiceBear Avatars](https://dicebear.com/) — 随机头像生成 API
- [Cloudflare Pages](https://pages.cloudflare.com/) — 托管和部署平台
- [Cloudflare D1](https://developers.cloudflare.com/d1/) — 边缘数据库

---

## 🔗 相关链接

- **仓库地址**: https://github.com/haenlau/guestbook
- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Cloudflare Pages 文档**: https://developers.cloudflare.com/pages/
- **D1 数据库文档**: https://developers.cloudflare.com/d1/
