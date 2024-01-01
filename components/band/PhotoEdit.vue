<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IPhoto} from "~/server/models/photo.model";
import PhotoUpload from "~/components/band/PhotoUpload.vue";

const {band} = defineProps<{ band: IBand }>()

async function deleteLink(photo: IPhoto) {
    if(!window.confirm(`Удалить фото?`)) return
    await useNuxtApp().$DELETE(`/photo/${photo.id}`)
    band.photos = band.photos.filter(p=>p.id!==photo.id)
}

async function applyHeader(type:string, photo:IPhoto){
    band[type] = photo.image
    await useNuxtApp().$POST(`/my-band/update`, {...band})
}

</script>

<template lang="pug">
div
    div.text-center
        PhotoUpload(:band="band")
    v-row(v-for="(photo,i) of band.photos" :key="i" align="center" )
        v-col
            img(:src="photo.thumb")
        v-col(cols="2")
            //v-btn(@click="deleteLink(photo)" icon="mdi-delete" color="red" size="x-small")
            ButtonTooltip(icon="mdi-delete" :click="()=>deleteLink(photo)" tooltip="Удалить фото" color="red")
        v-col(cols="2")
            ButtonTooltip(v-if="photo.image!==band.logo" icon="mdi-image-filter-tilt-shift" :click="()=>applyHeader('logo', photo)" tooltip="Установить как лого" )
        v-col(cols="2")
            ButtonTooltip(v-if="photo.image!==band.poster" icon="mdi-image-area" :click="()=>applyHeader('poster', photo)" tooltip="Установить как постер" )

    //BandPhotoView(:photos="band.photos")

</template>

<style scoped lang="sass">
img
    max-height: 100px
    max-width: 100px
</style>