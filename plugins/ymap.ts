import plugin from 'vue-yandex-maps'

export default defineNuxtPlugin((_nuxtApp) => {
    const runtimeConfig = useRuntimeConfig()
    console.log(runtimeConfig)
    _nuxtApp.vueApp.use(plugin, {
        apiKey: runtimeConfig.public.yandexMap,
        lang: 'ru_RU',
        debug:true,
        coordorder: 'latlong',
        enterprise: false,
        version: '2.1',
    })
})
