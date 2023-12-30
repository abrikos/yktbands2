<script setup lang="ts">
import type {IPhoto} from "~/server/models/photo.model";

const props = defineProps<{ photos: IPhoto[] }>()
const {photos} = props
const selectedPhoto = ref()
const showDialog = ref(false)
function prev(){
    selectedPhoto.value--
    if(selectedPhoto.value < 0) selectedPhoto.value = photos.length - 1
}
function next(){
    selectedPhoto.value++
    if(selectedPhoto.value >= photos.length) selectedPhoto.value = 0
}

</script>

<template lang="pug">
v-card
    v-toolbar(density="compact" )
        v-toolbar-title Фото {{selectedPhoto}}
    v-card-text
        div#photos.d-flex.flex-wrap
            img(v-for="(photo,i) of photos" :key="i"  :src="photo.thumb"
                @click="()=>{selectedPhoto=i; showDialog=!showDialog}")
    v-dialog(v-model="showDialog" xfullscreen="" )
        v-card(flat="true" rounded="10")
            v-toolbar(density="compact" )
                v-toolbar-title Просмотр фото
                v-divider(vertical inset)
                v-btn(@click="showDialog=false" icon="mdi-close")

            v-window(v-model="selectedPhoto")
                v-window-item(v-for="(photo, i) of photos" :key="i" :value="i")
                    v-card.d-flex.justify-center.align-center
                        img.full(:src="photos[i].image")
            v-card-actions.justify-center
                v-btn(variant="plain" icon="mdi-chevron-left" @click="prev")
                //v-item-group.text-center(v-model="selectedPhoto" mandatory )
                    v-item(v-for="(v,i) of band.photos" :key="i" v-slot="{isSelected, toggle}")
                        v-btn(icon="mdi-record" :variant="isSelected ? 'outlined' : 'text'")
                v-btn(variant="plain" icon="mdi-chevron-right" @click="next")
</template>

<style scoped lang="sass">
.full
    max-width: 900px
    max-height: 800px
#photos
    img
        max-width: 100px
        max-height: 100px
        margin: 5px
        cursor: pointer

</style>