<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IPlace} from "~/server/models/place.model";

import moment from 'moment'

const emit = defineEmits(['updateBand']);
const snackbar = useSnackbar();

const props = defineProps<{ band: IBand, places: IPlace[] }>()
const {band, places} = props

const newConcert = ref({bandId: band.id, placeId: null, coordinate: null as [number, number] | unknown, address: null as unknown, name: null as unknown, begin: 0})
const newDate = ref<Date>()
const bottomSheet = ref()
const newHour = ref<number>(20)
const selectedPlace = ref<IPlace>()
const hours = Array.from(Array(25).keys())

watch(newDate, (v) => {
    newConcert.value.begin = moment(v).unix() + newHour.value * 3600
})
watch(newHour, (v) => {
    newConcert.value.begin = moment(newDate.value).unix() + v * 3600
})

async function mapClick(e: any) {
    selectedPlace.value = undefined
    const coordinate = [e.latlng.lat, e.latlng.lng]
    const {data} = await useNuxtApp().$POST('/concert/address', coordinate)
    newConcert.value.name = null
    newConcert.value.address = data.value
    newConcert.value.coordinate = coordinate
}

function setHour(hour: number) {
    newHour.value = hour
}

async function addConcert() {
    newConcert.value.placeId = selectedPlace.value?.id
    await useNuxtApp().$PUT('/concert/create', newConcert.value)
    emit('updateBand')
}

function placeMarkerClick(place: IPlace) {
    if (selectedPlace.value?.id === place.id) {
        selectedPlace.value = undefined
        return
    }
    selectedPlace.value = place
}

function placeCancel() {
    selectedPlace.value = undefined
}

watch(selectedPlace,(v)=>{
    newConcert.value.name = v?.name
    newConcert.value.address = v?.address
    newConcert.value.coordinate = v?.coordinate
})

const errorsRef = ref({coordinate: 'Укажите ресторан на карте', name: 'Укажите название ресторана', address: 'Укажите адрес ресторана', begin: 'Укажите дату концерта'})
const errors = computed(() => {
    const body = newConcert.value
    if (selectedPlace.value) {
        errorsRef.value.coordinate = ''
        errorsRef.value.name = ''
        errorsRef.value.address = ''
    } else {
        if (body.coordinate) errorsRef.value.coordinate = ''
        if (body.name) errorsRef.value.name = ''
        if (body.address) errorsRef.value.address = ''
    }
    if (body.begin) errorsRef.value.begin = ''
    return errorsRef.value
})

</script>

<template lang="pug">
div
    v-row
        v-col(cols="4")
            v-card

                v-card-text
                    ul
                        li(v-for="(concert,i) of band.concerts" :key="i") {{i}} {{concert.place?.name}} {{concert.place?.address}}
        v-col
            v-dialog(fullscreen            :scrim="false"                transition="dialog-bottom-transition")
                template(v-slot:activator="{props}")
                    v-btn(v-bind="props" color="primary" ) Добавить новый концерт
                template( v-slot:default="{ isActive }")
                    v-card
                        v-card-text
                            v-row
                                v-col
                                    v-card-title Создание концерта
                                    v-divider
                                    small Для выбора существующего ресторана кликните по маркеру. Для создания нового - кликните по карте
                                    BandLeaflet(:cancel="placeCancel" :map-click="mapClick" :new-concert="newConcert" :selected-place="selectedPlace" :place-marker-click="placeMarkerClick" :places="places")

                                    v-combobox(placeholder="Поиск ресторана" item-title="fullName" item-value="id" :items="places" v-model="selectedPlace" density="compact" variant="outlined" )
                                        template(v-slot:prepend-inner)
                                            v-icon mdi-magnify
                                        template(v-slot:append-inner)
                                            v-btn(v-if="selectedPlace" @click="selectedPlace = undefined" icon="mdi-cancel")
                                    div {{newConcert.address}}
                                    v-text-field(placeholder="Введите название нового ресторана" v-if="!selectedPlace && !!newConcert.coordinate" v-model="newConcert.name" :messages="errors.name" :error="!!errors.name" variant="outlined" density="compact")
                                        template(v-slot:append-inner)
                                            v-btn(v-if="newConcert.name" @click="newConcert.name = undefined" icon="mdi-cancel")

                                v-col(cols="5")
                                    v-row
                                        v-col
                                            span Дата
                                            span.text-red.px-1 {{errors.begin}}
                                            v-date-picker.picker(v-model="newDate" hide-header show-adjacent-months title="zzz")
                                        v-col
                                            span Время
                                            div.d-flex.flex-wrap
                                                div.ma-1(v-for="hour of hours" :key="hour")
                                                    v-btn(@click="setHour(hour)" small :color="hour===newHour ? `secondary` : ''") {{hour > 9 ? hour : '0'+hour}}
                                    v-divider
                                    div.text-blue.px-2
                                        span.px-1(v-if="newConcert.name") Ресторан "{{newConcert.name}}",
                                        span.px-1(v-if="newConcert.address") {{newConcert.address}},
                                        span.px-1(v-if="newConcert.begin") {{moment.unix(newConcert.begin).format('YYYY-MM-DD HH:00')}}

                                    v-btn(v-if="!Object.values(errors).filter(e=>!!e).length" @click="isActive.value = false; addConcert()" color="primary") Создать концерт
                                    v-btn(@click="isActive.value = false") Закрыть


</template>

<style scoped lang="sass">
</style>