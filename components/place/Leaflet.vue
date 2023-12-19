<script setup lang="ts">
import type {IPlace} from "~/server/models/place.model";
import type {UnwrapRef} from "vue";
import type {IConcert} from "~/server/models/concert.model";


const props = defineProps<{
    place: IPlace,
}>()

</script>

<template lang="pug">
client-only
    l-map#leaflet(ref="map" :zoom="16" :center="place.coordinate")
        l-tile-layer(url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" layer-type="base" name="OpenStreetMap")
        l-marker(:lat-lng="place.coordinate")
            l-icon(icon-url="/marker-red.svg" :icon-anchor="[20,40]" )
    //small {{newConcert.place}}

</template>

<style scoped lang="sass">
#leaflet
    width: 100%
    height: 400px !important
</style>