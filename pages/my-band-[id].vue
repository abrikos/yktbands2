<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import MessagesEdit from "~/components/band/MessagesEdit.vue";

const route = useRoute()
const router = useRouter()

const {data, refresh: refreshBand, pending: pendingBand} = await useNuxtApp().$GET(`/my-band/${route.params.id}/view/`)
const band = data as IBand

const {$listen} = useNuxtApp()
$listen('my-band:refresh', () => {
    refreshBand()
})
$listen('my-band:update', async () => {
    await useNuxtApp().$POST(`/my-band/update`, band.value)
})

const tabsItems = {
    settings: {title: 'Параметры'},
    concerts: {title: 'Концерты'},
    instruments: {title: 'Состав группы'},
    photos: {title: 'Фото'},
    youtube: {title: 'Youtube'},
    share: {title: 'Администраторы'},
    messages: {title: 'Сообщения'},
}

const tab = computed({
    get() {
        return route.query.tab as string || 'settings'
    },
    async set(tab) {
        await router.replace({query: {...route.query, tab}})
    }
})
//const viewActions = computed(() => !['concerts', 'instruments', 'photos', 'messages'].includes(tab.value))
const {origin} = useRequestURL()

const fullUrl = computed(() => origin + band.value.viewLink)

</script>

<template lang="pug">
div
    h1(v-if="!band").text-red Группа не найдена
    div(v-else)
        h1
            span Группа "{{band.name}}"
        div
            a(:href="band.viewLink" target="_blank") {{fullUrl}}
            CopyBtn(:str="fullUrl" tooltip="Копировать ссылку")

        v-tabs(v-model="tab" density="compact")
            v-tab(v-for="(item, key) in tabsItems" :value="key" :key="key") {{item.title}}
        br
        v-row
            v-col(md="4")
                v-card
                    v-toolbar
                        v-toolbar-title {{tabsItems[tab].title}}
                    v-card-text
                        BandConcerts(v-if="tab==='concerts'" :band="band" )
                        BandSettings(v-if="tab==='settings'" :band="band" )
                        BandInstruments(v-if="tab==='instruments'" :band="band")
                        BandYoutube(v-if="tab==='youtube'" :band="band")
                        BandPhotoEdit(v-if="tab==='photos'" :band="band")
                        BandShare(v-if="tab==='share'" :band="band" :key="Math.random()")
                        MessagesEdit(v-if="tab==='messages'" :band="band")

            v-col
                BandView#preview(:band="band" :preview="true" :key="Math.random()")
</template>

<style scoped lang="sass">
//background-color: red
</style>