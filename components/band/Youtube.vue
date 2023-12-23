<script setup lang="ts">
import type {IBand, IBandResponse} from "~/server/models/band.model";
import YoutubePlayer from "~/components/band/YoutubePlayer.vue";

const {$event} = useNuxtApp()
const route = useRoute()
const {data: band, refresh: refreshBand} = await
        useNuxtApp().$GET(`/my-band/${route.params.id}/view/`) as unknown as IBandResponse
const newLink = ref()

async function addLink(){
    if(!newLink.value) return
    band.value.youtube.push(newLink.value)
    await useNuxtApp().$POST(`/my-band/update`, {...band.value})
    $event('band:refresh')
}
async function deleteLink(i:number){
    band.value.youtube.splice(i,1)
    await useNuxtApp().$POST(`/my-band/update`, {...band.value})
    $event('band:refresh')
}
</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Ролики Youtube
    v-card-text
        v-text-field(v-model="newLink" label="Добавить новый ролик" )
            template(v-slot:append-inner)
                v-btn(@click="addLink") Добавить
        div(v-for="(link,i) of band.youtube" :key="i" )
            div {{link}}
            YoutubePlayer(:link="link")
            v-btn(@click="deleteLink(i)" icon="mdi-delete" color="red")
</template>

<style scoped lang="sass">

</style>