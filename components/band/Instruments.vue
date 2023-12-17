<script setup lang="ts">

import type {IInstrument} from "~/server/models/instrument.model";
import type {IBand} from "~/server/models/band.model";

const props = defineProps<{ band: IBand }>()

const {data: artists, refresh: refreshArtists, pending: pA} = await useNuxtApp().$GET('/artist/all')// as unknown as IArtistResponse
const {$event} = useNuxtApp()

const {band} = props
const {instrumentPosition} = useAppConfig()
const instrumentsFiltered = band.instruments.filter((i: IInstrument) => i.artist.name)
        .sort((a: IInstrument, b: IInstrument) => a.artist.name > b.artist.name ? -1 : a.artist.name < b.artist.name ? 1 : 0)
        .reverse()

const newArtist = ref(null)
const instrumentForDialog: Ref<IInstrument | null> = ref(null)
const showDialog = ref(false)


async function addInstrument() {
    await useNuxtApp().$PUT(`/my-band/${band.id}/instrument`, {artist: newArtist})
    $event('band:refresh')
}

async function deleteInstrument(id: string) {
    await useNuxtApp().$DELETE(`/my-band/instrument/${id}`)
    $event('band:refresh')
}

function setInstrument(icon: string) {
    if (instrumentForDialog.value?.icons.includes(icon)) {
        instrumentForDialog.value.icons = instrumentForDialog.value?.icons.filter(i=>i!==icon) as string[]
    } else {
        instrumentForDialog.value?.icons.push(icon)
    }
}

async function saveIcons(){
    await useNuxtApp().$POST(`/my-band/instrument/${instrumentForDialog.value?.id}/icon`, instrumentForDialog.value?.icons, true)
    $event('band:refresh')

}
</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Состав коллектива
    v-card-text
        v-combobox(item-title="name" item-value="id" :items="artists" v-model="newArtist" label="Выбрать или создать артиста"  density="compact")
            template(v-slot:append)
                v-btn(@click="addInstrument" small) Добавить
        v-container
            v-row(v-for="(instrument,i) of instrumentsFiltered" :key="i" align="center" no-gutters)
                v-col(cols="3") {{instrument.artist.name}}
                v-col(cols="5")
                    BandInstrumentIcon(v-for="icon of instrument.icons" :key="icon" :icon="icon")
                v-col(cols="2")
                    v-btn(@click="instrumentForDialog=instrument;showDialog=true" size="x-small" ) Назначить инструменты
                v-col(cols="1")
                    v-btn(@click.prevent="deleteInstrument(instrument.id)" icon="mdi-delete" size="x-small" )
        v-dialog(v-model="showDialog" width="500" v-if="instrumentForDialog")
            v-card
                v-toolbar
                    v-toolbar-title Выберите инструменты для
                    v-divider(vertical inset)
                    v-btn(@click="showDialog=false" icon="mdi-close")
                v-card-text
                    span(v-for="(obj,i) of instrumentPosition" :key="i" @click="setInstrument(obj.key)")
                        BandInstrumentIcon(:icon="obj.key" :class="instrumentForDialog.icons.includes(obj.key) ? 'selected':''")
                v-card-actions
                    v-btn(@click="saveIcons") Сохранить
</template>

<style scoped lang="sass">
.selected
    border: 1px solid red
</style>