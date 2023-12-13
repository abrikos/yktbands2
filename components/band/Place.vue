<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IPlace} from "~/server/models/place.model";
import moment from 'moment'

const {$event} = useNuxtApp()
const props = defineProps<{ band: IBand, places: IPlace[] }>()
const {data: places, refresh: refreshPlaces, pending: pP} = await useNuxtApp().$GET('/place/all')// as unknown as IArtistResponse

const snackbar = useSnackbar();

const hours = Array.from(Array(25).keys())

const {band} = props

const newConcert = ref({bandId: band.id, place: {} as IPlace, begin: 0})
const newDate = ref<Date>()
watch(newDate, (v) => {
    newConcert.value.begin = moment(v).unix() + newHour.value * 3600
})

const newHour = ref<number>(20)
watch(newHour, (v) => {
    newConcert.value.begin = moment(newDate.value).unix() + v * 3600
})

async function mapClick(e: any) {
    const coordinate: [number, number] = [e.latlng.lat, e.latlng.lng]
    const {data} = await useNuxtApp().$POST('/concert/address', coordinate)
    newConcert.value.place = {id: '', address: data.value, coordinate} as IPlace
}

function setHour(hour: number) {
    newHour.value = hour
}

async function addConcert() {
    await useNuxtApp().$PUT('/concert/create', newConcert.value)
    $event('band:refresh')
    $event('dialog:close')
}

function placeMarkerClick(place: IPlace) {
    if (newConcert.value.place?.id === place.id) {
        newConcert.value.place = {} as IPlace
        return
    }
    newConcert.value.place = place
}

function placeCancel() {
    newConcert.value.place = {} as IPlace
}

const errors = {coordinate: '', name: '', begin: ''}

const placeSearch = ref()
watch(placeSearch, (v) => {
    newConcert.value.place = v
})

function canCreate() {
    return newConcert.value.place.id || (newConcert.value.place.name && newConcert.value.place.address && newConcert.value.place.coordinate)
}

</script>

<template lang="pug">
v-row
    v-col
        h3 Ресторан
        v-divider
        small Для выбора существующего ресторана кликните по маркеру. Для создания нового - кликните по карте
        BandLeaflet(:cancel="placeCancel" :map-click="mapClick" :new-concert="newConcert" :place-marker-click="placeMarkerClick" :places="places")

        v-combobox(placeholder="Поиск ресторана" item-title="fullName" item-value="id" :items="places" v-model="placeSearch" density="compact" variant="outlined" )
            template(v-slot:prepend-inner)
                v-icon mdi-magnify
            //template(v-slot:append-inner)
                v-btn(v-if="newConcert.place?.id" @click="newConcert.place = {}" icon="mdi-cancel")
        div(v-if="!newConcert.place.id && newConcert.place.coordinate")
            div {{newConcert.place?.address}}
            v-text-field(placeholder="Введите название нового ресторана" v-model="newConcert.place.name" variant="outlined" density="compact")
                template(v-slot:append-inner)
                    v-btn(v-if="newConcert.place.name" @click="newConcert.place.name = undefined" icon="mdi-cancel")

    v-col(cols="5")
        v-row
            v-col
                h3 Дата
                v-divider
                v-date-picker.picker(v-model="newDate" hide-header show-adjacent-months title="zzz")
            v-col
                h3 Время
                v-divider
                div.d-flex.flex-wrap
                    div.ma-1(v-for="hour of hours" :key="hour")
                        v-btn(@click="setHour(hour)" small :color="hour===newHour ? `secondary` : ''") {{hour > 9 ? hour : '0'+hour}}
        v-divider
        div.px-2
            span.text-blue.px-1(v-if="newConcert.place.name") Ресторан "{{newConcert.place.name.toUpperCase()}}",
            span.text-red.px-1(v-if="!newConcert.place.name" ) Укажите название ресторана.
            span.text-blue.px-1(v-if="newConcert.place.address") {{newConcert.place.address}},
            span.text-red.px-1(v-if="!newConcert.place.coordinate" ) Укажите адрес ресторана на карте.
            span.text-blue.px-1(v-if="newConcert.begin") {{moment.unix(newConcert.begin).format('YYYY-MM-DD HH:00')}}
            span.text-red.px-1(v-if="!newConcert.begin" ) Укажите дату концерта.
        v-divider
        v-btn(v-if="canCreate" @click="addConcert()" color="primary") Сохранить


</template>

<style scoped lang="sass">
</style>