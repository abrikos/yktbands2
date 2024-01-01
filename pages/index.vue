<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IConcert} from "~/server/models/concert.model";
import type {IArtist} from "~/server/models/artist.model";

interface IInfo {
    data: { concerts: IConcert[], bands: IBand, artists:IArtist[] }
    refresh: any
    pending: any
}
interface IBandResponse {
    data: IBand[]
    refresh: any
    pending: any
}

const {data} = await useNuxtApp().$GET('/start') as unknown as IInfo

</script>

<template lang="pug">
v-row
    v-col
        v-card
            v-card-title Концерты
            v-card-text
                table
                    tbody
                        tr(v-for="concert of data.concerts" :key="concert.id")
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
                        tr(v-for="band of data.bands" :key="band.id")
                            td
                                NuxtLink(:to="`/band-${band.id}`") {{band.name}}
    v-col
        v-card
            v-card-title Музыканты
            v-card-text
                table
                    tbody
                        tr(v-for="artist of data.artists" :key="artist.id")
                            td {{artist.name}}
                            td
                                div.d-flex.align-center(v-for="instrument of artist.instruments" :key="instrument.id")
                                        NuxtLink(:to="`/band-${instrument.band.id}`") {{instrument.band.name}}
                                        BandInstrumentIcon(v-for="icon of instrument.icons" :key="icon" :icon="icon")


</template>

<style scoped lang="sass">
.v-theme--dark
    tr
        border-bottom: 1px dotted gray
.v-theme--light
    tr
        border-bottom: 1px dotted silver
table
    width: 100%
    border-collapse: collapse
    td
        padding: 2px 0

</style>