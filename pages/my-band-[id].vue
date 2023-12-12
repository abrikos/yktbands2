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

const {data: band, refresh: refreshBand, pending} = await useNuxtApp().$GET('/my-band/view/' + route.params.id) as unknown as IBandResponse
const {data: artists, refresh: refreshArtists} = await useNuxtApp().$GET('/artist/all')// as unknown as IArtistResponse
const {data: places, refresh: refreshPlaces} = await useNuxtApp().$GET('/place/all', true)// as unknown as IArtistResponse

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
    h1 Группа "{{band.name || band.shortcut}}" {{band.concerts.length}}
    v-tabs(v-model="tab" density="compact")
        v-tab(v-for="(item, key) in tabsItems" :value="key" :key="key") {{item.title}}

    BandConcerts(v-if="tab==='concerts'" :band="band" :places="places||[]" @update-band="loadSaved" :key="Math.random()")
    BandSettings(v-if="tab==='settings'" :band="band" @update-band="loadSaved" :key="Math.random()")
    BandInstruments(v-if="tab==='instruments'" :artists="artists||[]" :band="band" @update-band="loadSaved" :key="Math.random()")

</template>

<style scoped lang="sass">
.wtf
    display: block
</style>