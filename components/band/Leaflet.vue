<script setup lang="ts">
import type {IPlace} from "~/server/models/place.model";
import type {UnwrapRef} from "vue";
import type {IConcert} from "~/server/models/concert.model";


const props = defineProps<{
    places: IPlace[],
    placeMarkerClick: (place: IPlace) => void,
    mapClick: (e: any) => Promise<void>,
    cancel: (e: any) => void,
    newConcert: UnwrapRef<IConcert | undefined>
}>()

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
    hoveredPosition.value =[e.originalEvent.layerX, e.originalEvent.layerY]
}

function mouseLeaveHandle(){
    hoveredPlace.value = undefined
}

const popupStyle = computed(()=>{
    const [left, top] = hoveredPosition.value ? hoveredPosition.value : [0,0]
    return `top:${top-20}px;left:${left+20}px`
    //return `top:${100}px;left:${100}px`
})
</script>

<template lang="pug">
client-only
    div#popup(:style="popupStyle" v-if="hoveredPlace?.name") {{hoveredPlace?.name}}, {{hoveredPlace?.address}}
    l-map#leaflet(ref="map" :zoom="16" :center="center" @click="mapClickHandler")
        l-tile-layer(url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" layer-type="base" name="OpenStreetMap")
        l-control(position="bottomright")
            v-btn(v-if="newConcert?.place.coordinate" icon="mdi-cancel" @click.stop="cancel")
        l-marker(v-for="(place,i) of places.filter(p=>p.coordinateValid)" :lat-lng="place.coordinate" :key="i" @click="placeMarkerClickHandler(place)" @mouseover="(e)=>mouseOverHandle(e,place)" @mouseout="mouseLeaveHandle")
            l-icon(v-if="newConcert?.place?.id!==place.id" icon-url="/marker-blue.svg" :icon-anchor="[20,40]" )
            l-icon(v-if="newConcert?.place?.id===place.id" icon-url="/marker-red.svg" :icon-anchor="[20,40]" )

        l-marker(v-if="newConcert?.place.coordinate && !newConcert?.place.id" :lat-lng="newConcert?.place.coordinate")
            l-icon(icon-url="/marker-red.svg" :icon-anchor="[20,40]" )
    //small {{newConcert.place}}

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
    height: 400px !important
</style>