<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IArtist} from "~/server/models/artist.model";
import type {IInstrument} from "~/server/models/instrument.model";

const {band} = defineProps<{ band: IBand }>()
const {data: artists, refresh: refreshArtists} = await useNuxtApp().$GET('/artist/all')
const {data: instrumentsData, refresh: refreshInstruments} = await useNuxtApp().$GET('/instrument/band/' + band.id)
const instruments = instrumentsData as IInstrument[]


const {instrumentPosition} = useAppConfig()

const selectedArtists = ref()

async function addInstrument() {
    await useNuxtApp().$PUT(`/instrument/upsert`, selectedArtists.value.map((artist:IArtist)=>({artist, band:band.id})))
    await refreshInstruments()
    band.instruments = instruments
}

async function deleteInstrument(instrument: IInstrument) {
    if (!confirm(`Удалить артиста ${instrument.artist.name}`)) return
    await useNuxtApp().$DELETE(`/instrument/${instrument.id}`)
    await refreshInstruments()
    band.instruments = instruments

}

async function setInstrument(instrument: IInstrument, icon: string) {
    if (instrument.icons.includes(icon)) {
        instrument.icons = instrument.icons.filter(i => i !== icon)
    } else {
        instrument.icons.push(icon)
    }
    await useNuxtApp().$PUT(`/instrument/upsert`, [instrument])
}

async function createArtist() {
    const {data: artist} = await useNuxtApp().$PUT(`/artist/create`, {name: newArtist.value})
    console.log(artist)
    await useNuxtApp().$PUT(`/instrument/upsert`, [{artist:artist.value, band:band.id}])
    refreshArtists()
    refreshInstruments()
    band.instruments = instruments
}

const newArtist = ref()

</script>

<template lang="pug">
v-text-field(v-model="newArtist" label="Создать нового музыканта" density="compact")
    template(v-slot:append)
        v-btn(v-if="newArtist" @click="createArtist" small) Создать

v-combobox(item-title="name" item-value="id" :items="artists.filter(a=>!instruments.map(i=>i.artist.id).includes(a.id))"
    v-model="selectedArtists"
    multiple=""
    label="Выбрать музыканта"
    density="compact")
    template(v-slot:append)
        v-btn(v-if="selectedArtists" @click="addInstrument" small) Добавить
v-container
    client-only
        table.instruments
            tbody
                tr(v-for="(instrument,i) of instruments" :key="'instr'+i" align="center" no-gutters)
                    td.text-left {{instrument.artist.name}}
                    td.icons
                        span(v-for="(obj,i) of instrumentPosition" :key="i" @click="setInstrument(instrument, obj.key)")
                            BandInstrumentIcon(:icon="obj.key" :class="instrument?.icons.includes(obj.key) ? 'selected':''")

                    //td.text-left
                        BandInstrumentIcon(v-for="icon of instrument.icons" :key="icon" :icon="icon")
                    //td
                        v-btn(@click="instrumentForDialog=instrument;showDialog=true" size="x-small" icon="mdi-music" color="primary")
                    td
                        v-btn(@click.prevent="deleteInstrument(instrument)" icon="mdi-delete" size="x-small" color="red")
</template>

<style scoped lang="sass">
.instruments
    width: 100%
    border-collapse: collapse

    tr
        td.icons
            width: 150px

        td
            border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity))
            padding: 5px 0

.selected
    border: 1px solid green
    border-radius: 25px
</style>