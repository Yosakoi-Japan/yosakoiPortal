// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 4351,
  },

  nitro: {
    serveStatic: true,
  },

  srcDir: "src/",
  ssr: true,
  components: true,
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
    public: {
      gtagId: process.env.GA_MEASUREMENT_ID,
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "ja",
      },
      titleTemplate: "%s | Yosakoi Portal",
      meta: [
        {
          name: "description",
          content:
            "Yosakoi Portalは全国のよさこいイベント情報をわかりやすく紹介する情報サイトです。開催日程や会場情報をまとめてチェックできます。",
        },
        {
          name: "google-site-verification",
          content: "N-zBPKgrZbA67mnumsEM0CTBbk5Ds6mwcjPOg2ddn4A",
        },
        { name: "format-detection", content: "telephone=no" },
        { property: "og:site_name", content: "Yosakoi Portal" },
        { property: "og:type", content: "website" },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/naruko.png" }],
    },
  },

  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
})
