<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import MessagesEdit from "~/components/band/MessagesEdit.vue";

const route = useRoute()
const router = useRouter()

const {data, refresh: refreshBand, pending: pendingBand} = await useNuxtApp().$GET(`/my-band/${route.params.id}/view/`)
const band = data as IBand

const { $listen } = useNuxtApp()
$listen('my-band:refresh',()=> {
    refreshBand()
})

const bandSnapshot = ref(band.value && JSON.parse(JSON.stringify(band.value)))
const edited = computed(()=>{
    return band.value && JSON.stringify(bandSnapshot.value) !== JSON.stringify(band.value)
})
function reset() {
    for(const key in band.value){
        band.value[key] = bandSnapshot.value[key]
    }
}
function snapshot() {
    for (const key in band.value) {
        bandSnapshot.value[key] = band.value[key]
    }
}
async function submit() {
    await useNuxtApp().$POST(`/my-band/update`, band.value)
    await refreshBand()
    snapshot()
}


const tabsItems = {
    settings: {title: 'Параметры'},
    concerts: {title: 'Концерты'},
    instruments: {title: 'Состав группы'},
    photo: {title: 'Фото'},
    youtube: {title: 'Youtube'},
    share: {title: 'Доступ для редактирования'},
    messages: {title: 'Сообщения'},
}

const tab = computed({
    get() {
        return route.query.tab || 'settings'
    },
    async set(tab) {
        await router.replace({query: {...route.query, tab}})
    }
})
const {origin} = useRequestURL()

const fullUrl = computed(() => {
    return `${origin}/band-${band.id}`
})
</script>

<template lang="pug">
h1(v-if="!band").text-red Группа не найдена
div(v-else)
    h1.d-flex.justify-center
        span Группа "{{band.name}}"
    div.d-flex.justify-center
        a(:href="band.viewLink" target="_blank") Перейти
        //CopyBtn(:str="fullUrl")

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
                    BandPhotoEdit(v-if="tab==='photo'" :band="band")
                    BandShare(v-if="tab==='share'" :band="band")
                    MessagesEdit(v-if="tab==='messages'" :band="band")
                v-card-actions(v-if="edited" )
                    v-btn(@click="submit" color="primary" ) Сохранить
                    v-spacer
                    v-btn(@click="reset") Сбросить

        v-col
            //a(:href="`/band-short-${band.shortcut}`" target="_blank") Перейти
            BandView#preview(:band="band" :preview="true" :key="Math.random()")
</template>

<style scoped lang="sass">
.wtf
    display: block
</style>