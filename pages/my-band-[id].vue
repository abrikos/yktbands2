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

const {data, refresh, pending} = await useNuxtApp().$GET('/my-band/my-view/' + route.params.id) as unknown as IBandResponse
const tabs = ref()
async function loadSaved(){
    refresh()
}

</script>

<template lang="pug">
div
    h1 Группа "{{data.name || data.shortcut}}"
    v-tabs(v-model="tabs" )
        v-tab(value="instruments") Состав
        v-tab(value="settings") Настройки
    v-window(v-model="tabs" )
        v-window-item(value="settings" )
            BandSettings(:band="data" @update-band="loadSaved" :key="Math.random()")
        v-window-item(value="instruments" )
            BandInstruments(:band="data" @update-band="loadSaved" :key="Math.random()")
</template>

<style scoped lang="sass">
.wtf
    display: block
</style>