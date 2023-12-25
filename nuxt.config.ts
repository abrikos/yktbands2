// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    modules: [
        '@invictus.codes/nuxt-vuetify',
        'nuxt-mongoose',
        'nuxt-snackbar',
        '@pinia/nuxt',
        'nuxt3-leaflet',
    ],
    runtimeConfig: {
        authExpiration: 3600 * 24,
        authRefreshBeforeExpiration: 3000,
        authTokenName: 'auth_token',
        public:{
            botName: process.env.BOT_NAME
        }
    },
    app: {
        head: {
            script: [
                //{src:`https://api-maps.yandex.ru/v3/?apikey=${process.env.YMAP}&lang=ru_RU`}
            ]
        }
    },
    snackbar: {
        bottom: true,
        right: true,
        duration: 5000
    },
    mongoose: {
        uri: process.env.MONGODB_URI,
        options: {},
        modelsDir: 'models',
    },
    css: ['vuetify/lib/styles/main.sass', '~/assets/vuetify.sass'],
    vuetify: {
        /* vuetify options */
        vuetifyOptions: {
            theme: {
                defaultTheme: 'dark'
            }
            // @TODO: list all vuetify options
        },

        moduleOptions: {
            //customVariables: ['~/assets/variables.scss'],
            /* nuxt-vuetify module options */
            treeshaking: true,
            useIconCDN: true,

            /* vite-plugin-vuetify options */
            styles: 'sass',
            autoImport: true,
            //useVuetifyLabs: true,
        }
    },
    build: {
        transpile: ['fetch-custom'],
    },
    devtools: {enabled: true}
})
