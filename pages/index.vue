<script setup lang="ts">
import type {IConcert} from "~/server/models/band.model";
import type {IBand} from "~/server/models/band.model";

interface IConcertResponse {
    data: IConcert[]
    refresh: any
    pending: any
}
interface IBandResponse {
    data: IBand[]
    refresh: any
    pending: any
}

const {data:concerts} = await useNuxtApp().$GET('/concert/all') as unknown as IConcertResponse
const {data:bands} = await useNuxtApp().$GET('/band/all') as unknown as IBandResponse

</script>

<template lang="pug">
v-row
    v-col
        v-card
            v-card-title Концерты
            v-card-text
                table
                    tbody
                        tr(v-for="concert of concerts" :key="concert.id")
                            td {{concert.dateHuman}}
                            td
                                NuxtLink(:to="`/band-${concert.band.id}`") {{concert.band.name}}
                            td
                                NuxtLink(:to="`/place-${concert.place.id}`") {{concert.place.fullName}}
    v-col
        v-card
            v-card-title Группы
            v-card-text
                table
                    tbody
                        tr(v-for="band of bands" :key="band.id")
                            td
                                NuxtLink(:to="`/band-${band.id}`") {{band.name}}

</template>

<style scoped>

</style>