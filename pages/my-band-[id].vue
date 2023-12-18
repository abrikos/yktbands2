<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";

definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})

const route = useRoute()
const router = useRouter()

interface IBandResponse {
    data: IBand
    refresh: any
    pending: any
}

const {data: band, refresh: refreshBand, pending: pendingBand} = await useNuxtApp().$GET(`/my-band/${route.params.id}/view/`) as
        unknown as IBandResponse
const { $listen, $event } = useNuxtApp()
$listen('band:refresh',()=> {
    refreshBand()
    $event('band-view:refresh');
})


const tabsItems = {
    concerts: {title: 'Концерты'},
    instruments: {title: 'Состав'},
    youtube: {title: 'Youtube'},
    settings: {title: 'Параметры'},

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
div
    h1 Группа "{{band.nameOrShortcut}}"
    v-tabs(v-model="tab" density="compact")
        v-tab(v-for="(item, key) in tabsItems" :value="key" :key="key") {{item.title}}

    v-row
        v-col(cols="4")
            BandConcerts(v-if="tab==='concerts'" :band="band")
            BandSettings(v-if="tab==='settings'" :band="band" :key="Math.random()")
            BandInstruments(v-if="tab==='instruments'" :band="band" :key="Math.random()")
            BandYoutube(v-if="tab==='youtube'" :band="band" :key="Math.random()")
        v-col
            //a(:href="`/band-short-${band.shortcut}`" target="_blank") Перейти
            BandView#preview(:key="Math.random()")
</template>

<style scoped lang="sass">
.wtf
    display: block
</style>