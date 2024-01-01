<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import YoutubePlayer from "~/components/band/YoutubePlayer.vue";

const {$event} = useNuxtApp()
const props = defineProps<{ band: IBand }>()
const {band} = props
const newLink = ref()

async function addLink() {
    if (!newLink.value) return
    band.youtube.push(newLink.value)
    await $event('my-band:update')
}

async function deleteLink(i: number) {
    band.youtube.splice(i, 1)
    await $event('my-band:update')
}


</script>

<template lang="pug">
v-card-text
    v-text-field(v-model="newLink" placeholder="Вставте ссылку на ролик Youtube" )
        template(v-slot:append-inner)
            v-btn(v-if="newLink" @click="addLink") Добавить
    div(v-for="(link,i) of band.youtube" :key="i" )
        div {{link}}
        YoutubePlayer(:link="link")
        ButtonTooltip(icon="mdi-delete" :click="()=>deleteLink(i)" tooltip="Удалить")
</template>

<style scoped lang="sass">

</style>