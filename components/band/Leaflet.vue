<script setup lang="ts">
import type {IPlace} from "~/server/models/place.model";

const props = defineProps<{ places: IPlace[], selectedPlace: IPlace, placeMarkerClick: (place: IPlace) => void, mapClick: (e: any) => Promise<void>, cancel: (e: any) => void, newConcert: {} }>()

const center = ref([62.02722510699265, 129.73493946155247])
const hoveredPlace = ref<IPlace>()
const hoveredPosition = ref()
function mapClickHandler(e: any) {
    center.value = [e.latlng.lat, e.latlng.lng]
    props.mapClick(e)
}

function placeMarkerClickHandler(place: IPlace) {
    props.placeMarkerClick(place)
    center.value = place.coordinate
}

function mouseOverHandle(e:any, place: IPlace) {
    hoveredPlace.value = place
    hoveredPosition.value =[e.originalEvent.clientX, e.originalEvent.clientY]
}

function mouseLeaveHandle(){
    hoveredPlace.value = undefined
}

const popupStyle = computed(()=>{
    const [left, top] = hoveredPosition.value ? hoveredPosition.value : [0,0]
    return `top:${top}px;left:${left}px`
    //return `top:${100}px;left:${100}px`
})
</script>

<template lang="pug">
client-only
    div#popup(:style="popupStyle" v-if="hoveredPlace?.name") {{hoveredPlace?.name}}, {{hoveredPlace?.address}}
    l-map#leaflet(ref="map" :zoom="16" :center="center" @click="mapClickHandler")
        l-tile-layer(url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" layer-type="base" name="OpenStreetMap")
        l-control(position="bottomright")
            v-btn(icon="mdi-cancel" @click="cancel")
        l-marker(v-for="(place,i) of places.filter(p=>p.coordinateValid)" :lat-lng="place.coordinate" :key="i" @click="placeMarkerClickHandler(place)" @mouseover="(e)=>mouseOverHandle(e,place)" @mouseout="mouseLeaveHandle")
            l-icon(v-if="selectedPlace?.id!==place.id" icon-url="/marker-blue.svg" :icon-anchor="[20,40]" )
            l-icon(v-if="selectedPlace?.id===place.id" icon-url="/marker-red.svg" :icon-anchor="[20,40]" )

        l-marker(v-if="newConcert.coordinate && !selectedPlace" :lat-lng="newConcert.coordinate")
            l-icon(icon-url="/marker-red.svg" :icon-anchor="[20,40]" )


</template>

<style scoped lang="sass">
#popup
    -webkit-box-shadow: 4px 4px 7px 0px rgba(34, 60, 80, 0.19)
    -moz-box-shadow: 4px 4px 7px 0px rgba(34, 60, 80, 0.19)
    box-shadow: 4px 4px 7px 0px rgba(34, 60, 80, 0.19)
    border-radius: 10px
    padding: 10px
    z-index: 100000000000
    position: absolute
    background-color: white
    color: black
#leaflet
    width: 100%
    height: 400px
</style>