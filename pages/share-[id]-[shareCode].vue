<script setup lang="ts">
import type {IBandResponse} from "~/server/models/band.model";
definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})

const route = useRoute()
const router = useRouter()

const {data: band, refresh: refreshBand, pending: pendingBand} = await
        useNuxtApp().$GET(`/band/${route.params.id}/view/`) as unknown as IBandResponse

async function getShare(shareCode:string){
    const {data:added} = await useNuxtApp().$POST(`/band/${band.value.id}/share`, {shareCode})
    if(added.value){
        await router.push(`/my-band-${band.value.id}`)
    }
}

const shareCode = computed(()=>route.params.shareCode as string)

</script>

<template lang="pug">
div Вам предоставлен доступ к группе &nbsp;
    NuxtLink(:to="`/band-${band.id}`") {{band.nameOrShortcut}}
    v-btn(@click="()=>getShare(shareCode)") Получить
</template>

<style scoped lang="sass">

</style>