<script setup lang="ts">
import type {IBand, IBandResponse} from "~/server/models/band.model";
import type {IConcert} from "~/server/models/concert.model";

const route = useRoute()
const {band} = defineProps<{ band: IBand }>()
const {$event, $listen} = useNuxtApp()
$listen('concert:update', (payload) => {
    if (concertEditIndex.value) {
        band.concerts[concertEditIndex.value] = payload as IConcert
    } else {
        band.concerts.push(payload as IConcert)
    }
})

const concertEditIndex = ref()

async function deleteConcert(i: number) {
    const deleted = band.concerts.splice(i, 1) as IConcert[]
    await useNuxtApp().$DELETE(`/concert/${deleted[0].id}`)
}

function editConcert(i: number) {
    $event('concertDialog:show', band.concerts[i])
    concertEditIndex.value = i
}

function createConcert() {
    $event('concertDialog:show', {place: {}, hour: 20, enabled: true})
}

onMounted(() => {
    //createConcert()
})


</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Концерты
        v-divider.mx-4(vertical inset)
        v-spacer
        v-btn(@click="createConcert" color="primary" ) Добавить новый концерт
    v-card-text
        table
            tbody
                tr
                    th Ресторан
                    th Дата
                    th Показывать
                tr(v-for="(concert,i) of band.concerts" :key="i" :class="!concert.id?'new-concert':''")
                    td {{concert.place.name.toUpperCase()}}, {{concert.place.address}}
                    td {{concert.dateHuman}}
                    td.text-center
                        v-switch(v-model="concert.enabled")
                    td
                        v-btn(@click="editConcert(i)" icon="mdi-pencil" size="x-small" color="primary")
                        v-btn(@click="deleteConcert(i)" icon="mdi-delete" size="x-small" color="red")

BandConcertDialog( :band="band")
</template>

<style scoped lang="sass">
table
    width: 100%
    .new-concert
        background-color: red
</style>