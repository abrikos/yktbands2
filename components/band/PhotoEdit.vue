<script setup lang="ts">
import type {IBandResponse} from "~/server/models/band.model";

const {$event} = useNuxtApp()
const route = useRoute()
const {data: band, refresh: refreshBand} = await
        useNuxtApp().$GET(`/my-band/${route.params.id}/view/`) as unknown as IBandResponse
const newLink = ref()

async function addLink(){
    if(!newLink.value) return
    band.value.photos.push(newLink.value)
    await useNuxtApp().$POST(`/my-band/update`, {...band.value}, true)
    $event('band:refresh')
}
async function deleteLink(i:number){
    band.value.photos.splice(i,1)
    await useNuxtApp().$POST(`/my-band/update`, {...band.value})
    $event('band:refresh')
}
</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Фото
    v-card-text
        v-text-field(v-model="newLink" placeholder="Вставте ссылку на фото" )
            template(v-slot:append-inner)
                v-btn(v-if="newLink" @click="addLink") Добавить
        div(v-for="(link,i) of band.photos" :key="i" )
            div {{link}}
                v-btn(@click="deleteLink(i)" icon="mdi-delete" color="red" size="x-small" )
            img(:src="link")
//BandPhotoView(:photos="band.photos")

</template>

<style scoped lang="sass">
img
    max-height: 100px
    max-width: 100px
</style>