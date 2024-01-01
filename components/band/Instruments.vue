<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IArtist} from "~/server/models/artist.model";
import type {IInstrument} from "~/server/models/instrument.model";

const {band} = defineProps<{ band: IBand }>()
const {data: artists, refresh: refreshArtists} = await useNuxtApp().$GET('/artist/all')

const {instrumentPosition} = useAppConfig()

const selectedArtists = ref()

async function addInstrument() {
    await useNuxtApp().$PUT(`/instrument/upsert`, selectedArtists.value.map((artist:IArtist)=>({artist, band:band.id})))
}

async function deleteInstrument(instrument: IInstrument) {
    if (!confirm(`Удалить артиста ${instrument.artist.name}`)) return
    await useNuxtApp().$DELETE(`/instrument/${instrument.id}`)
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
    await useNuxtApp().$PUT(`/instrument/upsert`, [{artist:artist.value, band:band.id}])
    refreshArtists()
    newArtist.value = null
}

const newArtist = ref()

</script>

<template lang="pug">
div
    v-text-field(v-model="newArtist" label="Создать нового музыканта" density="compact")
        template(v-slot:append)
            v-btn(v-if="newArtist" @click="createArtist" small) Создать

    v-combobox(item-title="name" item-value="id" :items="artists.filter(a=>!band.instruments.map(i=>i.artist.id).includes(a.id))"
        v-model="selectedArtists"
        multiple=""
        label="Выбрать музыкантов"
        density="compact")
        template(v-slot:append)
            v-btn(v-if="selectedArtists" @click="addInstrument" small) Добавить
    v-container
        client-only
                    v-row.instruments(v-for="(instrument,i) of band.instruments" :key="'instr'+i" align="center" no-gutters)
                        v-col {{instrument.artist.name}}
                        v-col(cols="4")
                            span(v-for="(obj,i) of instrumentPosition" :key="i" @click="setInstrument(instrument, obj.key)")
                                BandInstrumentIcon(:icon="obj.key" :class="instrument?.icons.includes(obj.key) ? 'selected':''")
                        v-col(cols="2")
                            ButtonTooltip(:click="()=>deleteInstrument(instrument)" icon="mdi-delete" tooltip="Отменить музыканта")

</template>

<style scoped lang="sass">
.instruments
    border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity))

.selected
    border: 1px solid green
    border-radius: 25px
</style>