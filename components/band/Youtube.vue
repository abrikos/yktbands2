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
}
async function deleteLink(i:number){
    band.youtube.splice(i,1)
}
</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Ролики Youtube
    v-card-text
        v-text-field(v-model="newLink" placeholder="Вставте ссылку на ролик Youtube" )
            template(v-slot:append-inner)
                v-btn(v-if="newLink" @click="addLink") Добавить
        div(v-for="(link,i) of band.youtube" :key="i" )
            div {{link}}
            YoutubePlayer(:link="link")
            v-btn(@click="deleteLink(i)" icon="mdi-delete" color="red")
</template>

<style scoped lang="sass">

</style>