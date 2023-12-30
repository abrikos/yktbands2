<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IConcert} from "~/server/models/concert.model";
import {awaitExpression} from "@babel/types";

const route = useRoute()
const {band} = defineProps<{ band: IBand }>()
const {data, refresh} = await useNuxtApp().$GET('/concert/band/' + band.id)
const concerts = data as IConcert[]
const {$event, $listen} = useNuxtApp()
$listen('concerts:update', async () => {
    await refresh()
    band.concerts = concerts
})

async function deleteConcert(concert:IConcert) {
    if(!window.confirm(`Удалить концерт ${concert.place.fullName} ${concert.dateHuman} ?`)) return
    await useNuxtApp().$DELETE(`/concert/${concert.id}`)
    await refresh()
    band.concerts = concerts
}

function editConcert(concert: IConcert) {
    $event('concertDialog:show', {...concert})
}

function createConcert() {
    $event('concertDialog:show', {place: {}, hour: 20, enabled: true})
}

function expired(concert:IConcert) {
    return new Date(concert.date) < new Date()
}

</script>

<template lang="pug">
v-btn(@click="createConcert" color="primary" ) Добавить новый концерт
table
    tbody
        tr
            th Ресторан
            th Дата
            //th Показывать
        tr(v-for="(concert,i) of concerts" :key="i" :class="expired(concert)?'new-concert':''")
            td {{concert.place.fullName}}
            td {{concert.dateHuman}}
            //td.text-center
                v-switch(v-model="concert.enabled")
            td
                v-btn(@click="editConcert(concert)" icon="mdi-pencil" size="x-small" color="primary")
                v-btn(@click="deleteConcert(concert)" icon="mdi-delete" size="x-small" color="red")

BandConcertDialog( :band="band")
</template>

<style scoped lang="sass">
table
    width: 100%

    .new-concert
        td:nth-child(2)
            border: 1px dotted red
            //background-color: red
</style>