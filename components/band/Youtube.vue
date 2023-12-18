<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import YoutubePlayer from "~/components/band/YoutubePlayer.vue";

const {$event} = useNuxtApp()
const props = defineProps<{ band: IBand }>()
const {band} = props
const newLink = ref()

async function addLink(){
    if(!newLink.value) return
    band.youtube.push(newLink.value)
    await useNuxtApp().$POST(`/my-band/update`, {...band})
    $event('band:refresh')
}
async function deleteLink(i:number){
    band.youtube.splice(i,1)
    console.log(band.youtube)
    await useNuxtApp().$POST(`/my-band/update`, {...band})
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
            YoutubePlayer(:link="link")
            v-btn(@click="deleteLink(i)" icon="mdi-delete" color="red")
</template>

<style scoped lang="sass">

</style>