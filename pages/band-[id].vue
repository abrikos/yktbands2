<script setup lang="ts">
const route = useRoute()
const {data: band, refresh: refreshBand, pending: pendingBand} = await
        useNuxtApp().$GET(`/band/${route.params.id}/view/`)
const { $listen } = useNuxtApp()
$listen('band:refresh',()=> {
    refreshBand()
})

const x = useServerSeoMeta({
    title: band.value.name,
    ogTitle: band.value.name,
    ogDescription: band.value.about,
    description: band.value.about,
    ogImage: band.value.logo,
})

</script>

<template lang="pug">
div
    BandView(v-if="band" :band="band")
    h1.text-red(v-else) Группа не найдена
</template>

<style scoped lang="sass">

</style>