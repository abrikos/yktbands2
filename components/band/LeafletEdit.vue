<script setup lang="ts">
import type {IPlace} from "~/server/models/place.model";
import type {IConcert} from "~/server/models/concert.model";


const {places, concert} = defineProps<{
    places: IPlace[],
    concert: IConcert
}>()

const center = ref([62.02722510699265, 129.73493946155247])
const hoveredPlace = ref<IPlace>()
const hoveredPosition = ref()
const placeSearch = ref()
const showLoader = ref()

async function mapClickHandler(e: any) {
    center.value = [e.latlng.lat, e.latlng.lng]
    concert.place = {coordinate: center.value, address:'...'} as IPlace
    placeSearch.value = null
    showLoader.value = true
    const {data} = await useNuxtApp().$POST('/concert/address', center.value)
    showLoader.value = false
    concert.place.address = data.value as string
}

function placeMarkerClickHandler(place: IPlace) {
    placeSearch.value = concert.place = place
    center.value = place.coordinate
}

function mouseOverHandle(e: any, place: IPlace) {
    hoveredPlace.value = place
    hoveredPosition.value = [e.originalEvent.layerX, e.originalEvent.layerY]
}

function mouseLeaveHandle() {
    hoveredPlace.value = undefined
}

const popupStyle = computed(() => {
    const [left, top] = hoveredPosition.value ? hoveredPosition.value : [0, 0]
    return `top:${top - 20}px;left:${left + 20}px`
    //return `top:${100}px;left:${100}px`
})

function cancel() {

}

watch(placeSearch, (n, o) => {
    if (n) concert.place = n
})

</script>

<template lang="pug">
div
    client-only
        div#popup(:style="popupStyle" v-if="hoveredPlace?.name") {{hoveredPlace?.name}}, {{hoveredPlace?.address}}
        l-map#leaflet(ref="map" :zoom="16" :center="concert.place?.coordinate || center" @click="mapClickHandler")
            l-tile-layer(url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" layer-type="base" name="OpenStreetMap")
            //l-control(position="bottomright")
                v-btn(v-if="concert?.place.coordinate" icon="mdi-cancel" @click.stop="cancel")
            l-marker(v-for="(place,i) of places.filter(p=>p.coordinateValid)" :lat-lng="place.coordinate" :key="i" @click="placeMarkerClickHandler(place)" @mouseover="(e)=>mouseOverHandle(e,place)" @mouseout="mouseLeaveHandle")
                l-icon(v-if="concert.place?.id!==place.id" icon-url="/marker-blue.svg" :icon-anchor="[20,40]" )
                l-icon(v-else icon-url="/marker-red.svg" :icon-anchor="[20,40]" )

            l-marker(v-if="concert.place?.coordinate" :lat-lng="concert.place.coordinate")
                l-icon(icon-url="/marker-red.svg" :icon-anchor="[20,40]" )
        //small {{newConcert.place}}
    v-combobox(placeholder="Поиск ресторана" item-title="fullName" item-value="id" :items="places" v-model="placeSearch" density="compact" variant="outlined" )
        template(v-slot:prepend-inner)
            v-icon mdi-magnify
    v-text-field(v-if="!concert.place?.id && concert.place.coordinate" v-model="concert.place.name"
        :loading="showLoader"
        :error-messages="!concert.place.name ? [`Название не указано`]:[]"
        :placeholder="`Введите название нового ресторана для ${concert.place.address}`"
        density="compact"
        variant="outlined" )

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