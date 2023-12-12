<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";

definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})

interface IBandResponse {
    data: IBand
    refresh: any
    pending: any
}

const route = useRoute()
const router = useRouter()

const {data: band, refresh: refreshBand, pending: pendingBand} = await useNuxtApp().$GET('/my-band/view/' + route.params.id) as unknown as IBandResponse
const {data: artists, refresh: refreshArtists, pending: pA} = await useNuxtApp().$GET('/artist/all')// as unknown as IArtistResponse
const {data: places, refresh: refreshPlaces, pending: pP} = await useNuxtApp().$GET('/place/all')// as unknown as IArtistResponse

const tabsItems = {
    concerts: {title: 'Концерты'},
    instruments: {title: 'Состав'},
    settings: {title: 'Параметры'},

}

async function loadSaved() {
    refreshBand()
    refreshArtists()
    refreshPlaces()
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
    div(v-if="!pendingBand" )
        BandConcerts(v-if="tab==='concerts'" :band="band" :places="places||[]" @update-band="loadSaved")
        BandSettings(v-if="tab==='settings'" :band="band" @update-band="loadSaved")
        BandInstruments(v-if="tab==='instruments'" :artists="artists||[]" :band="band" @update-band="loadSaved")

</template>

<style scoped lang="sass">
.wtf
    display: block
</style>