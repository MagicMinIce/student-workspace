/**
 * Supabase 配置文件
 *
 * 使用前请按以下步骤操作：
 * 1. 打开 https://supabase.com/ 注册账号（可用 GitHub 登录）
 * 2. 点击 "New Project" 创建项目
 * 3. 填写项目名称，设置数据库密码（记下来），选择区域（推荐 Singapore）
 * 4. 等待项目初始化完成（约 1-2 分钟）
 * 5. 在左侧菜单选择 "SQL Editor"，粘贴并运行建表 SQL（见下方）
 * 6. 在左侧菜单选择 "Project Settings" -> "API"
 * 7. 复制 "Project URL" 和 "anon public" 密钥，填入下方
 * 8. 保存本文件，刷新页面即可使用
 *
 * 建表 SQL（在 SQL Editor 中运行）：
 * ---------------------------------------------------------
 * CREATE TABLE workspaces (
 *     id TEXT PRIMARY KEY,
 *     data JSONB,
 *     timestamp BIGINT,
 *     device TEXT,
 *     created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- 禁用行级安全（测试模式，允许所有读写）
 * ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;
 *
 * -- 启用实时订阅
 * ALTER PUBLICATION supabase_realtime ADD TABLE workspaces;
 * ---------------------------------------------------------
 *
 * 注意：免费额度完全够个人使用
 * - 500MB 数据库存储
 * - 无限 API 请求
 * - 实时 WebSocket 订阅
 * - 国内可访问（AWS 新加坡节点）
 */

// ↓↓↓ 把你在 Supabase 控制台获取的配置粘贴到下面 ↓↓↓
window.SUPABASE_CONFIG = {
    url: "https://jntqsajetwytrsqxicyl.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudHFzYWpldHd5dHJzcXhpY3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNDk1MzUsImV4cCI6MjEwMTYyNTUzNX0.L5H4mvrWv7_bsuswC4Jn9RkSv7_rB10ibegHLVYfKCs"
};
