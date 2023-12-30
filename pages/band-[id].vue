<script setup lang="ts">
const route = useRoute()
const {data: band, refresh: refreshBand, pending: pendingBand} = await
        useNuxtApp().$GET(`/band/${route.params.id}/view/`)
const { $listen } = useNuxtApp()
$listen('band:refresh',()=> {
    refreshBand()
})

</script>

<template lang="pug">
div
    BandView(v-if="band" :band="band")
    h1.text-red(v-else) Группа не найдена
</template>

<style scoped lang="sass">

</style>