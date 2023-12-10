<script setup lang="ts">
import type {PropType} from "vue";
import type {IInstrument} from "~/server/models/instrument.model";
import type {IBand} from "~/server/models/band.model";
import {useTheme} from "vuetify";

const emit = defineEmits(['updateBand']);
const theme = useTheme()
const props = defineProps({
    band: {type: Object as PropType<IBand>, required: true}
})

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

const {band} = props
const instrumentsFiltered = band.instruments.filter((i: IInstrument) => i.artist.name)
        .sort((a: IInstrument, b: IInstrument) => a.artist.name > b.artist.name ? -1 : a.artist.name < b.artist.name ? 1 : 0)
        .reverse()

const newArtist = ref('')
const instrumentForDialog: Ref<IInstrument | null> = ref(null)
const showDialog = ref(false)

async function addInstrument() {
    await useNuxtApp().$PUT(`/band/${band.id}/instrument`, {artist: newArtist})
    emit('updateBand')
}

async function deleteInstrument(id: string) {
    await useNuxtApp().$DELETE(`/band/instrument/${id}`)
    emit('updateBand')
}

async function setInstrument(icon: string) {
    await useNuxtApp().$POST(`/band/instrument/${instrumentForDialog.value?.id}/icon`,{icon})
    emit('updateBand')
    showDialog.value = false
    instrumentForDialog.value = null
}

</script>

<template lang="pug">
v-card
    v-card-title Состав коллектива
    v-card-text
        v-text-field(v-model="newArtist" label="Новый артист")
        v-btn(@click="addInstrument" small) Создать
        v-list
            v-list-item(v-for="(instrument,i) of instrumentsFiltered" :key="i") {{instrument.artist.name}}
                v-btn(@click.prevent="deleteInstrument(instrument.id)" icon="mdi-delete")
                v-btn(@click="instrumentForDialog=instrument;showDialog=true" small)
                    span.instrument(v-if="instrument.icon" :style="instrumentPosition[instrument.icon]")
                    span(v-if="!instrument.icon") Выбрать инструмент
        v-dialog(v-model="showDialog" width="500" v-if="instrumentForDialog")
            v-card
                v-card-title Выберите инструмент для
                v-card-text
                    div.instrument(v-for="(style,key) of instrumentPosition" :key="key" @click="setInstrument(key)" :style="style")

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