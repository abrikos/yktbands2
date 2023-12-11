<script setup lang="ts">
import type {PropType} from "vue";
import type {IInstrument} from "~/server/models/instrument.model";
import type {IBand} from "~/server/models/band.model";
import type {IArtist} from "~/server/models/artist.model";

const emit = defineEmits(['updateBand']);
const props = defineProps({
    band: {type: Object as PropType<IBand>, required: true},
    artists: {type: Object as PropType<IArtist[]>, required: true}
})
const {band, artists} = props

const instrumentPosition = {
    guitar: {backgroundPosition: '0 0'},
    piano: {backgroundPosition: '0 -46px'},
    drum: {backgroundPosition: '0 -94px'},

    bass: {backgroundPosition: '-50px 0'},
    vocal: {backgroundPosition: '-50px -46px'},
    keyboard: {backgroundPosition: '-50px -94px'},

    violin: {backgroundPosition: '-100px 0'},
    trump: {backgroundPosition: '-100px -48px'},
    mixer: {backgroundPosition: '-100px -94px'},
}



const instrumentsFiltered = band.instruments.filter((i: IInstrument) => i.artist.name)
        .sort((a: IInstrument, b: IInstrument) => a.artist.name > b.artist.name ? -1 : a.artist.name < b.artist.name ? 1 : 0)
        .reverse()

const newArtist = ref(null)
const instrumentForDialog: Ref<IInstrument | null> = ref(null)
const showDialog = ref(false)


async function addInstrument() {
    await useNuxtApp().$PUT(`/my-band/${band.id}/instrument`, {artist: newArtist})
    emit('updateBand')
}

async function deleteInstrument(id: string) {
    await useNuxtApp().$DELETE(`/my-band/instrument/${id}`)
    emit('updateBand')
}

async function setInstrument(icon: string) {
    showDialog.value = false
    if (!instrumentForDialog.value?.icons?.includes(icon)) {
        const icons = instrumentForDialog.value?.icons
        icons?.push(icon)
        await useNuxtApp().$POST(`/my-band/instrument/${instrumentForDialog.value?.id}/icon`, {icons}, true)
        emit('updateBand')
    }
    instrumentForDialog.value = null
}

async function removeInstrument(instrument:IInstrument, icon: string) {
    const icons = instrument.icons.filter(i => i !== icon)
    await useNuxtApp().$POST(`/my-band/instrument/${instrument.id}/icon`, {icons}, true)
    emit('updateBand')
}

</script>

<template lang="pug">
v-card
    v-card-title Состав коллектива
    v-card-text
        v-combobox(item-title="name" item-value="id" :items="artists" v-model="newArtist" label="Выбрать или создать артиста"  density="compact")
            template(v-slot:append)
                v-btn(@click="addInstrument" small) Добавить
        v-container
            v-row(v-for="(instrument,i) of instrumentsFiltered" :key="i" align="center" no-gutters)
                v-col(cols="3") {{instrument.artist.name}}
                v-col(cols="5")
                    span.instrument(v-for="icon of instrument.icons" :key="icon" :style="instrumentPosition[icon]" @click="removeInstrument(instrument, icon)")
                v-col(cols="2")
                    v-btn(@click="instrumentForDialog=instrument;showDialog=true" size="x-small" ) Назначить инструменты
                v-col(cols="1")
                    v-btn(@click.prevent="deleteInstrument(instrument.id)" icon="mdi-delete" size="x-small" )
        v-dialog(v-model="showDialog" width="500" v-if="instrumentForDialog")
            v-card
                v-card-title Выберите инструменты для
                v-card-text
                    div.instrument(v-for="(key,i) of Object.keys(instrumentPosition).filter(k=>!instrumentForDialog.icons.includes(k))" :key="key" @click="setInstrument(key)" :style="instrumentPosition[key]")

</template>

<style scoped lang="sass">
.v-theme--dark
    .instrument
        filter: invert(1)

.instrument
    cursor: pointer
    //border: 1px solid red
    display: inline-block
    width: 50px
    height: 50px
    background-image: url('/instruments.png')
    //background-position: -20px -20px
    background-size: 150px

</style>