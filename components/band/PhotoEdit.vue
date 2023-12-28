<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IInstrument} from "~/server/models/instrument.model";
import type {IPhoto} from "~/server/models/photo.model";

const {$event} = useNuxtApp()
const {band} = defineProps<{ band: IBand }>()
const {data, refresh} = await useNuxtApp().$GET(`/photo/band/${band.id}`)
const photos = data as IPhoto[]
const input = ref()
const loading = ref()

async function deleteLink(photo: IPhoto) {
    //if(!window.confirm(`Удалить фото?`)) return
    await useNuxtApp().$DELETE(`/photo/${photo.id}`)
    await refresh()
    band.photos = photos
}

async function upload(e: any) {
    loading.value = true
    const formData = new FormData()
    for (const file of e.target.files)
        formData.append('photo', file)
    await useNuxtApp().$PUT(`/photo/band/${band.id}/upload`, formData)
    input.value.value = null
    await refresh()
    band.photos = photos
    loading.value = false

}

</script>

<template lang="pug">
input(type="file" ref="input" @change="upload" hidden multiple)
v-btn(@click="()=>input.click()" :loading="loading") Выбрать файл

div(v-for="(photo,i) of photos" :key="i" )
    div
        v-btn(@click="deleteLink(photo)" icon="mdi-delete" color="red" size="x-small")
    img(:src="photo.thumb")
//BandPhotoView(:photos="band.photos")

</template>

<style scoped lang="sass">
img
    max-height: 100px
    max-width: 100px
</style>