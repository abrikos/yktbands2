<script setup lang="ts">
import type {IInstrument, IBand, IBandResponse} from "~/server/models/band.model";
import type {IArtist} from "~/server/models/artist.model";


const {data: artists, refresh: refreshArtists} = await useNuxtApp().$GET('/artist/all')
const {band} = defineProps<{ band: IBand }>()

const {instrumentPosition} = useAppConfig()
const instrumentsFiltered = computed(() => band.instruments
                .sort((a: IInstrument, b: IInstrument) => a.artist.name > b.artist.name ? -1 : a.artist.name < b.artist.name ? 1 : 0)
                .reverse()
        //.filter((i: IInstrument) => i.artist.name)
)

const selectedArtists = ref()

async function addInstrument() {
    for (const artist of selectedArtists.value) {
        if (band.instruments.map(instr => instr.artist.id).includes(artist.id)) continue
        insertArtist(artist)
    }
    selectedArtists.value = null
}

function insertArtist(artist:IArtist){
    const instrument: IInstrument = {artist, icons: [] as string[]} as IInstrument
    band.instruments.push(instrument)
}

async function deleteInstrument(i: number) {
    if (!confirm(`Удалить артиста ${band.instruments[i].artist.name}`)) return
    band.instruments.splice(i, 1)
}

function setInstrument(instrument: IInstrument, icon: string) {
    if (instrument.icons.includes(icon)) {
        instrument.icons = instrument.icons.filter(i => i !== icon)
    } else {
        instrument.icons.push(icon)
    }
}

async function createArtist() {
    const {data} = await useNuxtApp().$PUT(`/artist/create`, {name: newArtist.value})
    refreshArtists()
    const artist = data.value as IArtist
    insertArtist(artist)
    newArtist.value = null
}

const newArtist = ref()

</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Состав коллектива
    v-card-text
        v-text-field(v-model="newArtist" label="Создать нового музыканта" density="compact")
            template(v-slot:append)
                v-btn(v-if="newArtist" @click="createArtist" small) Создать

        v-combobox(item-title="name" item-value="id" :items="artists" v-model="selectedArtists"
            multiple=""
            label="Выбрать музыканта"
            density="compact")
            template(v-slot:append)
                v-btn(v-if="selectedArtists" @click="addInstrument" small) Добавить
        v-container
            table.instruments
                tbody
                    tr(v-for="(instrument,i) of instrumentsFiltered" :key="'instr'+i" align="center" no-gutters)
                        td.text-left {{instrument.artist.name}}
                        td.icons
                            span(v-for="(obj,i) of instrumentPosition" :key="i" @click="setInstrument(instrument, obj.key)")
                                BandInstrumentIcon(:icon="obj.key" :class="instrument?.icons.includes(obj.key) ? 'selected':''")

                        //td.text-left
                            BandInstrumentIcon(v-for="icon of instrument.icons" :key="icon" :icon="icon")
                        //td
                            v-btn(@click="instrumentForDialog=instrument;showDialog=true" size="x-small" icon="mdi-music" color="primary")
                        td
                            v-btn(@click.prevent="deleteInstrument(i)" icon="mdi-delete" size="x-small" color="red")
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