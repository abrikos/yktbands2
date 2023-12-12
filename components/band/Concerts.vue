<script setup lang="ts">
import type {PropType} from "vue";
import type {IBand} from "~/server/models/band.model";
import type {IPlace} from "~/server/models/place.model";
import {YandexMap, YandexMarker} from 'vue-yandex-maps';
import moment from 'moment'

const emit = defineEmits(['updateBand']);
const snackbar = useSnackbar();

const props = defineProps<{band:IBand, places:IPlace[]}>()
const {band, places} = props

const defaultConcert = {bandId: band.id, placeId: null, coordinate: null as [number, number] | unknown, address: null as unknown, name: null as unknown, begin: 0}
const newConcert = ref(defaultConcert)
const newDate = ref<Date>()
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
    const coordinate = e.get('coords')
    const {data} = await useNuxtApp().$POST('/concert/address', coordinate)
    newConcert.value.name = null
    newConcert.value.address = data.value
    newConcert.value.coordinate = coordinate
}

function setHour(hour: number) {
    newHour.value = hour
}

async function addConcert() {
    const type = 'warning'
    const errors: string[] = []
    const body = newConcert.value
    body.placeId = selectedPlace.value?.id
    if (!body.placeId) {
        if (!body.coordinate) errors.push('Укажите ресторан на карте')
        if (!body.name) errors.push('Укажите название ресторана')
        if (!body.address) errors.push('Укажите адрес ресторана')
    }
    if (errors.length) {
        errors.forEach((text: string) => snackbar.add({type, text}))
        return
    }
    await useNuxtApp().$PUT('/concert/create', body)
    emit('updateBand')
}

function placeMarkerClick(place: IPlace) {
    selectedPlace.value = place
    newConcert.value.name = place.name
    newConcert.value.address = place.address
}

const errors = computed(() => {
    const errors = {coordinate: '', name: '', address: '', begin:''}
    const body = newConcert.value
    if (!selectedPlace.value) {
        if (!body.coordinate) errors.coordinate = ('Укажите ресторан на карте')
        if (!body.name) errors.name = ('Укажите название ресторана')
        if (!body.address) errors.address = ('Укажите адрес ресторана')
        if (!body.begin) errors.begin = ('Укажите дату концерта')
    }
    return errors
})

const isNameSet = computed(()=>!!newConcert.value.name)

</script>

<template lang="pug">
v-row
    v-col(cols="4")
        v-card

            v-card-text
                ul
                    li(v-for="(concert,i) of band.concerts" :key="i") {{i}} {{concert.place?.name}}
    v-col
        v-card
            v-card-title Создание концерта
                small.text-blue.px-2
                    span.px-1(v-if="newConcert.name") Ресторан "{{newConcert.name}}",
                    span.px-1(v-if="newConcert.address") {{newConcert.address}},
                    span.px-1(v-if="newConcert.begin") в {{moment.unix(newConcert.begin).format('YYYY-MM-DD HH:00')}}
                br
                v-btn(v-if="!Object.values(errors).filter(e=>!!e).length" @click="addConcert" color="primary") Создать концерт
            v-card-text
                v-combobox(v-if="!newConcert.coordinate" item-title="fullName" item-value="id" :items="places" v-model="selectedPlace" label="Выбрите существующий ресторан")
                    template(v-slot:append)
                        v-btn(v-if="selectedPlace" @click="selectedPlace = undefined" icon="mdi-cancel")

                v-text-field(v-if="!selectedPlace && !!newConcert.coordinate" v-model="newConcert.name" label="Название ресторана" :messages="errors.name" :error="!!errors.name")
                    template(v-slot:append-inner)
                        v-btn(v-if="newConcert.name" @click="newConcert.name = undefined" icon="mdi-cancel")
                span Для выбора существующего кликните по маркеру. Для создания нового кликните по дому когда курсор отображает руку раскрывшую 5 пальцев
                BandYandexMap(:map-click="mapClick" :new-concert="newConcert" :place-marker-click="placeMarkerClick" :places="places")
                div.text-red {{errors.coordinate}}
            v-row
                v-col Дата
                    span.text-red.px-1 {{errors.begin}}
                    v-date-picker.picker(v-model="newDate" hide-header show-adjacent-months title="zzz")
                v-col Время
                    div.d-flex.flex-wrap
                        div.ma-2(v-for="hour of hours" :key="hour")
                            v-btn(@click="setHour(hour)" small :color="hour===newHour ? `secondary` : ''") {{hour}}



</template>

<style scoped lang="sass">
</style>