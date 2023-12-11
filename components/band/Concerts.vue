<script setup lang="ts">
import type {PropType} from "vue";
import type {IBand} from "~/server/models/band.model";
import type {IPlace} from "~/server/models/place.model";
import {YandexMap, YandexMarker} from 'vue-yandex-maps';
import moment from 'moment'

const emit = defineEmits(['updateBand']);
const props = defineProps({
    band: {type: Object as PropType<IBand>, required: true},
    places: {type: Array as PropType<Array<IPlace>>, required: true},
})
const {band, places} = props
const defaultConcert = {band, begin: 0, place: {id: null, name: null, coordinate: null, address: null}}
const newConcert = ref(defaultConcert)
const newDate = ref()
const newHour = ref()
const step = ref('place')
const steps = [
    {title: '', key: 'start'},
    {title: 'Место проведения', key: 'place'},
    {title: 'Дата', key: 'date'},
    {title: 'Время', key: 'hour'},
    {title: 'Всё готово', key: 'fin'}
]
const center = [62.02722510699265, 129.73493946155247]
const hours = Array.from(Array(25).keys())

watch(newDate, (v) => {
    newConcert.value.begin = moment(v).unix()
})
watch(newHour, (v) => {
    newConcert.value.begin = moment(newDate.value).unix() + v * 3600
})

async function mapClick(e: any) {
    const coordinate = e.get('coords')
    const {data} = await useNuxtApp().$POST('/concert/address', coordinate)
    newConcert.value.place.address = data.value
    newConcert.value.place.coordinate = coordinate
}

function markerClick(place: IPlace) {
    newConcert.value.place = place
}

function setHour(hour: number) {
    newHour.value = hour
}

function stepsResult() {
    return 'Ваш выбор:'
}

function nextStep() {
    const stepObject = steps.find(s => s.key === step.value)
    const stepIdx = stepObject ? steps.indexOf(stepObject) : 0
    const nextStepObject = steps[stepIdx + 1]
    step.value = nextStepObject ? nextStepObject.key : steps[0].key
}

function prevStep() {
    const stepObject = steps.find(s => s.key === step.value)
    const stepIdx = stepObject ? steps.indexOf(stepObject) : 0
    const prevStepObject = steps[stepIdx - 1]
    step.value = prevStepObject ? prevStepObject.key : steps[0].key
}

async function addConcert() {
    await useNuxtApp().$PUT('/concert/create', newConcert.value, true)
    emit('updateBand')
    newConcert.value = defaultConcert
    nextStep()
}

async function choosePlace() {
    emit('updateBand')
}

function stepTitle() {
    const stepObject = steps.find(s => s.key === step.value)
    return stepObject ? stepObject.title : 'Step NF'
}

</script>

<template lang="pug">
v-card
    v-card-title Концерты
    v-card-text
        v-row
            v-col(cols="4") LIST
            v-col
                h2 {{stepTitle()}}
                v-window(v-model="step")
                    div.window-iem(value="start")
                        v-btn(color="primary" @click="nextStep") Начать создание концерта
                        v-btn(color="error" @click="addConcert") Создать концерт
                    div.window-iem(value="place")
                        v-combobox(item-title="name" item-value="id" :items="places" v-model="newConcert.place.id" label="Выбрите существующий ресторан"  density="compact" @change="choosePlace")
                        v-text-field(v-model="newConcert.place.name" label="Введите название нового ресторана" :disabled="!!newConcert.place.id")
                        v-text-field(v-model="newConcert.place.address" label="Адрес" :disabled="!!newConcert.place.id")

                        client-only
                            span Для выбора существующего кликните по маркеру. Для создания нового - по дому когда курсор отображает руку раскрывшую 5 пальцев
                            YandexMap#map(:coordinates="center" :zoom="16"   map-type="map" @click="mapClick")
                                YandexMarker(v-if="newConcert.place.coordinate" :coordinates="newConcert.place.coordinate" marker-id="new-marker")
                                YandexMarker(v-for="(place,i) of places" :coordinates="place.coordinate" :marker-id="`m${i}`" :key="i" @click="markerClick(place)")
                        div(v-if="newConcert.place.name")
                            v-btn(@click="nextStep" color="primary") Далее

                    div.window-iem(value="date")
                        v-date-picker(v-model="newDate" hide-header show-adjacent-months title="zzz" )
                        div(v-if="newDate")
                            h1 Вы выбрали {{moment(newDate).format('YYYY-MM-DD')}}
                            v-btn(@click="nextStep" color="primary") Далее

                    div.window-iem(value="hour")
                        div.d-flex.flex-wrap
                            div.ma-2(v-for="hour of hours" :key="hour")
                                v-btn(@click="setHour(hour)" small :color="hour===newHour ? `primary` : ''") {{hour}}
                        h1 Вы выбрали {{moment.unix(newConcert.begin).format('YYYY-MM-DD HH:mm')}}
                        v-btn(v-if="newHour >= 0" @click="nextStep" color="primary") Далее

                    div.window-iem(value="fin")
                        div.d-flex.justify-center
                            v-btn(color="danger" @click="addConcert") Создать концерт
                h1 {{stepsResult()}}
                hr.my-3
                v-btn(v-if="step !=='start'" @click="prevStep") Вернуться
                v-btn(@click="nextStep" color="primary") Далее


</template>

<style scoped lang="sass">
#map
    width: 100%
    height: 300px
    border: 1px solid red
</style>