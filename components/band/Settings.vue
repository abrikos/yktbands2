<script setup lang="ts">
const route = useRoute()
const {$event} = useNuxtApp()
const {band} = defineProps<{ band: IBand }>()


</script>

<template lang="pug">
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