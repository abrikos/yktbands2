<script setup lang="ts">
import type {IBandResponse} from "~/server/models/band.model";

const route = useRoute()
const {$event} = useNuxtApp()
const {data: band, refresh: refreshBand, pending: pendingBand} = await
        useNuxtApp().$GET(`/my-band/${route.params.id}/view/`) as unknown as IBandResponse


const edited = ref(false)

async function submit() {
    await useNuxtApp().$POST(`/my-band/update`, {...band})
    $event('band:refresh')
}

function reset() {
    $event('band:refresh');
    edited.value = false
}

const url = useRequestURL().origin

const fullUrl = computed(()=>{
    return `${url}/band-${band.value.id}`
})
const shareUrl = computed(()=>{
    return `${url}/share-${band.value.id}-${band.value.shareCode}`
})

async function createShare(cancel:boolean){
    await useNuxtApp().$POST(`/my-band/${band.value.id}/share`,{cancel})
    $event('band:refresh');
}

</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Параметры
        v-divider(vertical inset)
        v-btn(@click="submit" color="primary" ) Сохранить
        v-btn(@click="reset") Сбросить
    v-card-text
        v-text-field(v-model="band.name" label="Название")
        v-text-field(v-model="band.logo" label="Логотип")
        v-text-field(v-model="band.poster" label="Постер")
        v-switch(v-model="band.enabled" label="Отображать для всех")
        a(:href="fullUrl" target="_blank") Перейти
        CopyBtn(:str="fullUrl")
        div
            div(v-if="band.shareCode" )
                div Ссылка доступна только для подключения одного юзера
                div {{shareUrl}}
                    CopyBtn(:str="shareUrl")
                v-btn(@click="createShare(true)") Отменить доступ
            v-btn(v-else @click="createShare") Дать доступ к группе


</template>

<style scoped lang="sass">
//#preview
    transform: scale(.5)
    transform-origin: top left
</style>