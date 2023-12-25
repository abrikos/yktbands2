<script setup lang="ts">
import type {IBandResponse} from "~/server/models/band.model";

const route = useRoute()
const router = useRouter()

const {data: band, refresh: refreshBand, pending: pendingBand} = await
        useNuxtApp().$GET(`/band/${route.params.id}/view/`) as unknown as IBandResponse

async function getShare(){
    const {data:added} = await useNuxtApp().$POST(`/band/${band.value.id}/share`, route.params)
    if(added.value){
        await router.push(`/my-band-${band.value.id}`)
    }
}


if(band.value.shareCode !== route.params.shareCode) throw createError({statusCode: 403, message:
            'Вы не можете получить доступ к этой группе'})
</script>

<template lang="pug">
div Вам предоставлен доступ к группе &nbsp;
    NuxtLink(:to="`/band-${band.id}`") {{band.nameOrShortcut}}
    v-btn(@click="getShare") Получить
</template>

<style scoped lang="sass">

</style>