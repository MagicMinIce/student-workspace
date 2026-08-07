/**
 * Firebase 配置文件
 *
 * 使用前请按以下步骤操作：
 * 1. 打开 https://console.firebase.google.com/
 * 2. 点击"创建项目"（或使用已有项目）
 * 3. 项目创建后，点击"添加应用" -> 选择 Web (</>)
 * 4. 填写应用昵称（随意），注册应用
 * 5. 复制生成的 firebaseConfig 内容，填入下方
 * 6. 在左侧菜单选择"Realtime Database" -> 创建数据库
 * 7. 选择"测试模式"（允许所有读写），点击启用
 * 8. 保存本文件，刷新页面即可使用
 *
 * 注意：免费额度（Spark 计划）完全够个人使用
 * - 1GB 存储空间
 * - 每月 10GB 下载流量
 * - 100 个同时连接
 */

// ↓↓↓ 把你在 Firebase 控制台获取的配置粘贴到下面 ↓↓↓
window.FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
