<script setup lang="ts">
import type {  PropType } from "vue";
import type {IInstrument} from "~/server/models/instrument.model";
import type {IBand} from "~/server/models/band.model";
const emit = defineEmits(['updateBand']);
const props = defineProps({
    band:{type:Object as PropType<IBand>, required:true}
})

const {band} = props
const instrumentsFiltered = band.instruments.filter((i:IInstrument) => i.artist.name)
        .sort((a:IInstrument, b:IInstrument) => a.artist.name > b.artist.name ? -1 : a.artist.name < b.artist.name ? 1 : 0)
        .reverse()
const newArtist = ref('')
async function addInstrument(){
    await useNuxtApp().$PUT(`/band/${band.id}/instrument`, {artist:newArtist})
    emit('updateBand')
}

async function deleteInstrument(id:string){
    await useNuxtApp().$DELETE(`/band/instrument/${id}`)
    emit('updateBand')
}

</script>

<template lang="pug">
v-card
    v-card-title Состав коллектива
    v-card-text
        v-text-field(v-model="newArtist" label="Новый артист")
        v-btn(@click="addInstrument" small) Создать
        v-list {{instrumentsFiltered.length}}
            v-list-item(v-for="(instrument,i) of instrumentsFiltered" :key="i") {{instrument.artist}}
                v-btn(@click.prevent="deleteInstrument(instrument.id)" icon="mdi-delete")
</template>

<style scoped>

</style>