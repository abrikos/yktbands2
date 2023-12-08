// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@invictus.codes/nuxt-vuetify', 'nuxt-mongoose'],
  mongoose: {
    uri: process.env.MONGODB_URI,
    options: {},
    modelsDir: 'models',
  },
  css: ['vuetify/lib/styles/main.sass'],
  vuetify: {
    /* vuetify options */
    vuetifyOptions: {
      theme:{
        defaultTheme: 'dark'
      }
      // @TODO: list all vuetify options
    },

    moduleOptions: {
      /* nuxt-vuetify module options */
      //treeshaking: true,
      useIconCDN: true,

      /* vite-plugin-vuetify options */
      styles: 'sass',
      autoImport: true ,
      //useVuetifyLabs: true,
    }
  },
  build: {
    transpile: ['fetch-custom'],
  },
  devtools: { enabled: true }
})
