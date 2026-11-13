/* site-config.js · 部署配置（上线前填好这两行）
 *
 * 这个文件交给 GitHub Pages 公开托管是安全的：
 *   - SUPABASE_URL 是项目地址，本来就公开
 *   - SUPABASE_ANON_KEY 是「公开匿名 key」，Supabase 设计上就允许放前端
 *   - 真正敏感的 service_role key 绝不进前端；密码表也不直接开放
 * 后端/数据库全在 Supabase，不需要你自己的服务器。
 */
window.SiteConfig = {
  // Supabase 项目地址，形如 https://xxxx.supabase.co
  SUPABASE_URL: "https://nrzudsasplxugfbsyhts.supabase.co",

  // Supabase 公开 publishable key（Project Settings → API Keys → Publishable key）
  SUPABASE_ANON_KEY: "sb_publishable_W6ib-LMvan8_N7J-HQv8fA_m80HUKrT",

  // 每个密码默认可用次数（后台生成时也能单独设）
  MAX_USES: 3
};
