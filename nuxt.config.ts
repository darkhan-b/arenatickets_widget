// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      charset: 'utf-8',
      viewport:
        'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no',
      title: 'Arenatickets widget',
      meta: [
        { name: 'description', content: 'Arenatickets widget' },
        { name: 'author', content: 'Offlime.kz' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.NUXT_API_URL,
      API_TOKEN: process.env.NUXT_API_TOKEN,
      widgetUrl: process.env.NUXT_WIDGET_URL
    }
  },
  ssr: false,
  css: ['~/assets/scss/app.scss'],
  vite: {
    plugins: [svgLoader()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
              @import "@/assets/scss/_variables.scss";
              @import "@/assets/scss/_mixins.scss";
            `
        }
      }
    },
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development' ? ['naive-ui', 'vueuc'] : []
    }
  },
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer'
          ]
        : ['@juggle/resize-observer']
  },
  modules: ['@pinia/nuxt']
})
