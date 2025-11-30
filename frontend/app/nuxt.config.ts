// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 4351,
  },

  nitro: {
    serveStatic: true,
  },

  srcDir: 'src/',
  ssr: true,
  components: true,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],

  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
})
