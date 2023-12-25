<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";

const {$event} = useNuxtApp()
const {band} = defineProps<{ band: IBand }>()

const newLink = ref()

function addLink() {
    if (!newLink.value) return
    band.photos.push(newLink.value)
}

function deleteLink(i: number) {
    band.photos.splice(i, 1)
}

</script>

<template lang="pug">
v-text-field(v-model="newLink" placeholder="Вставте ссылку на фото" )
    template(v-slot:append-inner)
        v-btn(v-if="newLink" @click="addLink") Добавить
div(v-for="(link,i) of band.photos" :key="i" )
    div
        v-btn(@click="deleteLink(i)" icon="mdi-delete" color="red" size="x-small" )
        span {{link}}
    img(:src="link")
//BandPhotoView(:photos="band.photos")

</template>

<style scoped lang="sass">
img
    max-height: 100px
    max-width: 100px
</style>