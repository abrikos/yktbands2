<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {UnwrapRef} from "vue";


definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})

interface IBandResponse {
    data: IBand
    refresh: any
    pending: any
}

const route = useRoute()

const {data, refresh, pending} = await useNuxtApp().$GET('/band/my-view/' + route.params.id) as unknown as IBandResponse
const edited = ref(false)
function submit() {
    useNuxtApp().$POST('/band/update/' + route.params.id, data)
}

async function bandRequest(){
    return
}

async function loadSaved(){
    console.log('SSSSSSSSSSSs')
    refresh()
    edited.value = false
}

</script>

<template lang="pug">
div
    h1 Группа "{{data.name || data.shortcut}}"
    v-card
        v-card-title Параметры
        v-card-text
            v-text-field(v-model="data.name" label="Название" v-on:keyup="edited=true")
            v-text-field(v-model="data.shortcut" label="Уникальный путь" hint="Используется для создания уникальной ссылки на страницу коллектива. Только цифры, английские символыи нижнее подчеркивание" persistent-hint  v-on:keyup="edited=true" )
            v-switch(v-model="data.enabled" label="Отображать для всех" v-on:change="edited=true")
        v-card-actions(v-if="edited")
            v-btn(@click="submit") Сохранить
            v-spacer
            v-btn(@click="loadSaved") Сбросить
    br
    BandInstruments(:band="data" @update-band="loadSaved" :key="Math.random()")
</template>

<style scoped lang="sass">
.instrument
    cursor: pointer
    //border: 1px solid red
    display: inline-block
    width: 50px
    height: 50px
    background-image: url('/instruments.png')
    //background-position: -20px -20px
    background-size: 150px

</style>