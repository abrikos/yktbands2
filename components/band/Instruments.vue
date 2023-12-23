<script setup lang="ts">

import type {IInstrument} from "~/server/models/instrument.model";
import type {IBandResponse} from "~/server/models/band.model";



const {data: artists, refresh: refreshArtists} = await useNuxtApp().$GET('/artist/all')
const route = useRoute()
const {data: band, refresh: refreshBand} = await
        useNuxtApp().$GET(`/my-band/${route.params.id}/view/`) as unknown as IBandResponse
const {$event} = useNuxtApp()


const {instrumentPosition} = useAppConfig()
const instrumentsFiltered = computed(() => band.value.instruments
                .sort((a: IInstrument, b: IInstrument) => a.artist.name > b.artist.name ? -1 : a.artist.name < b.artist.name ? 1 : 0)
                .reverse()
        //.filter((i: IInstrument) => i.artist.name)
)

const newArtist = ref()
const instrumentForDialog = ref<IInstrument>()


async function addInstrument() {
    await useNuxtApp().$PUT(`/my-band/${band.value.id}/instrument`, {artist: newArtist.value})
    await refreshArtists()
    await refreshBand()
    $event('band-view:refresh')
}

async function deleteInstrument(instrument: IInstrument) {
    if (!confirm(`Удалить артиста ${instrument.artist.name}`)) return
    await useNuxtApp().$DELETE(`/my-band/instrument/${instrument.id}`)
    $event('band-view:refresh')
    await refreshArtists()
    await refreshBand()
}

function setInstrument(icon: string) {
    if (instrumentForDialog.value?.icons.includes(icon)) {
        instrumentForDialog.value.icons = instrumentForDialog.value?.icons.filter(i => i !== icon) as string[]
    } else {
        instrumentForDialog.value?.icons.push(icon)
    }
}

async function saveIcons() {
    await useNuxtApp().$POST(`/my-band/instrument/${instrumentForDialog.value?.id}/icon`, instrumentForDialog.value?.icons)
    await refreshArtists()
    await refreshBand()
    instrumentForDialog.value = undefined
    $event('band-view:refresh')
}

const showDialog = computed({
    get(){
        return !!instrumentForDialog.value
    },
    set(){

    }
})
</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Состав коллектива {{showDialog}}
    v-card-text
        v-combobox(item-title="name" item-value="id" :items="artists" v-model="newArtist" label="Выбрать или создать артиста"  density="compact")
            template(v-slot:append)
                v-btn(@click="addInstrument" small) Добавить
        v-container
            table.instruments
                tbody
                    tr(v-for="(instrument,i) of instrumentsFiltered" :key="i" align="center" no-gutters)
                        td.text-left {{instrument.artist.name}}
                        td.text-left
                            BandInstrumentIcon(v-for="icon of instrument.icons" :key="icon" :icon="icon")
                        td
                            v-btn(@click="instrumentForDialog=instrument;showDialog=true" size="x-small" icon="mdi-music" color="primary")
                        td
                            v-btn(@click.prevent="deleteInstrument(instrument)" icon="mdi-delete" size="x-small" color="red")
        v-dialog(v-model="showDialog" width="500")
            v-card
                v-toolbar
                    v-toolbar-title Выберите инструменты для
                    v-divider(vertical inset)
                    v-btn(@click="showDialog=false" icon="mdi-close")
                v-card-text
                    span(v-for="(obj,i) of instrumentPosition" :key="i" @click="setInstrument(obj.key)")
                        BandInstrumentIcon(:icon="obj.key" :class="instrumentForDialog?.icons.includes(obj.key) ? 'selected':''")
                v-card-actions
                    v-btn(@click="saveIcons" color="primary" ) Сохранить
</template>

<style scoped lang="sass">
.instruments
    width: 100%
    border-collapse: collapse

    tr
        td
            border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity))
            padding: 5px 0

.selected
    border: 1px solid red
</style>