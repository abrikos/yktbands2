<script setup lang="ts">
//import L from 'leaflet'
import type {IPlace} from "~/server/models/place.model";

const props = defineProps<{ places: IPlace[], selectedPlace: IPlace, placeMarkerClick:(place:IPlace)=>void, mapClick:(e: any) => Promise<void>, newConcert:{}}>()

const center = [62.02722510699265, 129.73493946155247]

function test(i:number){
    console.log(i)
}

</script>

<template lang="pug">
div
    div#leaflet
        LMap(ref="map" :zoom="16" :center="center" @click="mapClick")
            LTileLayer(url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" layer-type="base" name="OpenStreetMap")

            LMarker(v-for="(place,i) of places.filter(p=>p.coordinateValid)" :lat-lng="place.coordinate" :key="i" @click="placeMarkerClick(place)")
                LIcon(v-if="selectedPlace?.id!==place.id" icon-url="/marker-blue.svg" :icon-anchor="[20,40]" )
                LIcon(v-if="selectedPlace?.id===place.id" icon-url="/marker-red.svg" :icon-anchor="[20,40]" )

            LMarker(v-if="newConcert.coordinate && !selectedPlace" :lat-lng="newConcert.coordinate")
                LIcon(icon-url="/marker-red.svg" :icon-anchor="[20,40]" )



</template>

<style scoped lang="sass">
#leaflet
    width: 100%
    height: 400px
</style>