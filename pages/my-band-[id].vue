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

const {data, refresh:refreshBand, pending} = await useNuxtApp().$GET('/my-band/my-view/' + route.params.id) as unknown as IBandResponse
const {data:artists, refresh:refreshArtists} = await useNuxtApp().$GET('/artist/all')// as unknown as IArtistResponse

const tabsItems = {
    instruments: {component: resolveComponent('BandInstruments'), title: 'Состав'},
    av: {component: resolveComponent('UserAvatar'), title: 'Av'},

    settings: {component: resolveComponent('BandSettings'), title: 'Параметры'},



}

async function loadSaved() {
    refreshBand()
    refreshArtists()
}

const tabs = computed({
    get() {
        return route.query.tab
    },
    async set(tab) {
        await router.replace({query:{...route.query, tab}})
    }
})

async function tabNavigate(tab: string) {
    await router.replace({query:{...route.query, tab}})
}

</script>

<template lang="pug">
div
    h1 Группа "{{data.name || data.shortcut}}" {{tabs}}
    v-tabs(v-model="tabs" density="compact")
        v-tab(v-for="(item, key) in tabsItems" :value="key" :key="key") {{item.title}}

    v-window(v-model="tabs" )
        v-window-item(v-for="(item, key) in tabsItems" :value="key" :key="key" )
            component(:is="item.component" :user="{}" :artists="artists" :band="data" @update-band="loadSaved" :key="Math.random()")

</template>

<style scoped lang="sass">
.wtf
    display: block
</style>