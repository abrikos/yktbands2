<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";

const {band, type} = defineProps<{ band: IBand, type?:string }>()
const loading = ref()
const input = ref()

async function upload(e: any) {
    loading.value = true
    const formData = new FormData()
    for (const file of e.target.files) {
        formData.append('photo', file)
    }
    const {data:photos} = await useNuxtApp().$PUT(`/photo/band/${band.id}/upload`, formData)

    if(type){
        band[type] = photos.value[0].image
    }
    input.value.value = null
    band.photos = photos
    loading.value = false
}

</script>

<template lang="pug">
input(type="file" ref="input" @change="upload" hidden multiple)
v-btn(@click="()=>input.click()" :loading="loading" color="primary" )
    span(v-if="type==='logo'" ) Загрузить лого
    span(v-else-if="type==='poster'" ) Загрузить постер
    span(v-else) Загрузить фото

</template>

<style scoped lang="sass">

</style>