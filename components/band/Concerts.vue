<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IConcert} from "~/server/models/concert.model";

const props = defineProps<{ band: IBand }>()
const {$event} = useNuxtApp()

const concertEdit = ref()


const listHeaders = [
     {title: 'Ресторан', key: 'place.fullName', width:200},
    {title: 'Дата', key: 'dateHuman', width:200},
    {title: 'Показывать', key: 'enabled'},
    {title: '', key: 'actions'},
]

async function updateConcert(concert: IConcert) {
    await useNuxtApp().$PUT('/concert/upsert', concert)
    $event('band:refresh')
}

async function deleteConcert(concert: IConcert) {
    await useNuxtApp().$DELETE('/concert/delete/' + concert.id)
    $event('band:refresh')
}

function editConcert(concert: IConcert) {
    $event('concertDialog:show', concert)
}
</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Концерты
        v-divider.mx-4(vertical inset)
        v-spacer
        BandConcertEdit(:band="band" :concert="concertEdit")

    v-card-text
        v-data-table(:items="band.concerts" :headers="listHeaders" density="compact" )
            template(v-slot:item.actions="{item}")
                v-btn(@click="editConcert(item)" icon="mdi-pencil" size="x-small" color="primary")
                v-btn(@click="async()=>await deleteConcert(item)" icon="mdi-delete" size="x-small" color="red")
            template(v-slot:item.enabled="{item}")
                v-checkbox(v-model="item.enabled" @change="()=>updateConcert(item)")


</template>

<style scoped lang="sass">
</style>