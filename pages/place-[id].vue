<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IPlace} from "~/server/models/place.model";

const route = useRoute()

interface IPlaceResponse {
    data: IPlace
    refresh: any
    pending: any
}

const {data: place, refresh: refreshBand, pending: pendingBand} = await
        useNuxtApp().$GET(`/place/${route.params.id}/view`) as unknown as IPlaceResponse

</script>

<template lang="pug">
div
    v-toolbar(color="primary" )
        v-toolbar-title {{place.fullName}}
    PlaceLeaflet(:place="place")
    v-card
        v-card-title Концерты
        v-card-text

            div(v-for="concert of place.concerts") {{concert.dateHuman}}
                NuxtLink(:to="`/band-${concert.band.id}`") {{concert.band.name}}


</template>

<style scoped lang="sass">

</style>