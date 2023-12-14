<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";

const route = useRoute()
interface IBandResponse {
    data: IBand
    refresh: any
    pending: any
}

const {data, refresh: refreshBand, pending: pendingBand} = await
        useNuxtApp().$GET(`/band/${route.params.id}/view/`)// as unknown as IBandResponse
if(!data.value){
    console.log('zzzzzzzzzzz', route.params)
    showError({statusCode:404, message:'Такая группа не найдена'})
}
const band:IBand = data.value as IBand
const { $listen } = useNuxtApp()
$listen('band:refresh',()=>refreshBand())

</script>

<template lang="pug">
v-card(v-if="band")
    v-toolbar(color="primary" )
        v-toolbar-title {{band.nameOrShortcut}}
        v-divider.mx-4(vertical inset)
        v-btn Button
    v-card-text
        v-row
            v-col
                img.logo(:src="band.logo" xonerror="this.src='/logo.svg'")
            v-col
                img.poster(:src="band.poster" onerror="this.src='/logo.svg'")

</template>

<style scoped lang="sass">

</style>