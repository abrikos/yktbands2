<script setup lang="ts">
import type {IBandResponse} from "~/server/models/band.model";

const route = useRoute()
const {$event} = useNuxtApp()
const {band} = defineProps<{ band: IBand }>()


</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Параметры
    v-card-text
        v-text-field(v-model="band.name" label="Название")
        v-text-field(v-model="band.logo" label="Логотип")
        v-text-field(v-model="band.poster" label="Постер")
        v-switch(v-model="band.enabled" label="Отображать для всех")

</template>

<style scoped lang="sass">
//#preview
    transform: scale(.5)
    transform-origin: top left
</style>