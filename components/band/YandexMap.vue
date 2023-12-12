<script setup lang="ts">
import type {IPlace} from "~/server/models/place.model";
const center = [62.02722510699265, 129.73493946155247]

const props = defineProps<{ places: IPlace[], placeMarkerClick:(place:IPlace)=>void, mapClick:(e: any) => Promise<void>, newConcert:{}}>()
const markerIcon = {
    layout: 'default#imageWithContent',
            imageHref: 'https://image.flaticon.com/icons/png/512/33/33447.png',
            imageSize: [43, 43],
            imageOffset: [0, 0],
            content: '123 v12',
            contentOffset: [0, 15],
            contentLayout: '<div style="background: red; width: 50px; color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
}
</script>

<template lang="pug">
client-only
    YandexMap#map(:coordinates="center" :zoom="16"   map-type="map" @click="mapClick")
        YandexMarker(v-if="newConcert.coordinate" :coordinates="newConcert.coordinate" marker-id="new-marker" )
        YandexMarker(v-for="(place,i) of places.filter(p=>p.coordinateValid)" :coordinates="place.coordinate" :marker-id="`m${i}`" :key="i" @click="placeMarkerClick(place)")
</template>

<style scoped lang="sass">
#map
    width: 100%
    height: 300px

</style>