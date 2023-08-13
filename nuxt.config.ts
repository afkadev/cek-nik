// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:false,
  css: [
    'bootstrap/dist/css/bootstrap-utilities.min.css',
  ],
  modules: [
    '@element-plus/nuxt',
    '@vueuse/nuxt',
  ],
  elementPlus: { /** Options */ }
})
