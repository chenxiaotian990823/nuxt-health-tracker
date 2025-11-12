// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  devServer: {
    host: '0.0.0.0', // 绑定所有网络接口，使局域网可访问
    port: 3000,      // 可选，指定端口
  },
  runtimeConfig: {
    public: {
      supabaseUrl: "https://ysomyfafyykxhhngglak.supabase.co", //process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzb215ZmFmeXlreGhobmdnbGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MTAwNzUsImV4cCI6MjA3ODQ4NjA3NX0.7ECLzAd-9zeAZxzSUxirGZZijYSUsQ97QtrznNRYbxI", // process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
});
