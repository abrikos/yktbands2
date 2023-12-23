<script setup lang="ts">
import type {IBand, IBandResponse} from "~/server/models/band.model";

definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})

const route = useRoute()
const router = useRouter()

const {data, refresh: refreshBand, pending: pendingBand} = await useNuxtApp().$GET(`/my-band/${route.params.id}/view/`)
const band = data.value as IBand
const { $listen, $event } = useNuxtApp()
$listen('band:refresh',()=> {
    refreshBand()
    $event('band-view:refresh');
})


const tabsItems = {
    settings: {title: 'Параметры'},
    concerts: {title: 'Концерты'},
    instruments: {title: 'Состав'},
    photo: {title: 'Фото'},
    youtube: {title: 'Youtube'},


}

async function loadSaved() {
    refreshBand()
    //refreshArtists()
    //refreshPlaces()
}

const tab = computed({
    get() {
        return route.query.tab
    },
    async set(tab) {
        await router.replace({query: {...route.query, tab}})
    }
})

async function tabNavigate(tab: string) {
    await router.replace({query: {...route.query, tab}})
}
</script>

<template lang="pug">
div(v-if="band")
    h1 Группа "{{band.nameOrShortcut}}" {{band.photos.length}}
    v-tabs(v-model="tab" density="compact")
        v-tab(v-for="(item, key) in tabsItems" :value="key" :key="key") {{item.title}}

    v-row
        v-col(cols="4")
            BandConcerts(v-if="tab==='concerts'")
            BandSettings(v-if="tab==='settings'")
            BandInstruments(v-if="tab==='instruments'" :band="band" :key="Math.random()")
            BandYoutube(v-if="tab==='youtube'" :band="band")
            BandPhotoEdit(v-if="tab==='photo'" :band="band")
        v-col
            //a(:href="`/band-short-${band.shortcut}`" target="_blank") Перейти
            BandView#preview(:band="band" :key="Math.random()")
</template>

<style scoped lang="sass">
.wtf
    display: block
</style>