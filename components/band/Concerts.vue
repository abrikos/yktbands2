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
const newConcert = ref()
const newDate = ref()
const newHour = ref()
const step = ref('place')
const steps = [
    {title: '', key: 'start'},
    {title: 'Выберите место проведения', key: 'place'},
    {title: 'Выберите дату', key: 'date'},
    {title: 'Выберите время', key: 'hour'},
    {title: 'Создайте концерт', key: 'fin'}
]
const center = [62.02722510699265, 129.73493946155247]
const hours = Array.from(Array(25).keys())

newConcert.value = {
    begin: 0,
    place: null
}

watch(newDate, (v) => {
    newConcert.value.begin = moment(v).unix()
})
watch(newHour, (v) => {
    newConcert.value.begin = moment(newDate.value).unix() + v * 3600
})

async function mapClick(e: any) {
    console.log(e.get('coords'))
}

function markerClick(place: IPlace) {

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

async function addConcert() {
    newConcert.value.begin = 0
    newConcert.value.place = null
    nextStep()
}

</script>

<template lang="pug">
v-card
    v-card-title Концерты
    v-card-text
        v-row
            v-col(cols="4") LIST
            v-col {{newConcert}}
                h2 {{steps[step||0]}}
                v-window(v-model="step")
                    v-window-item(value="start")
                        v-btn(v-if="!newConcert.begin" color="primary" @click="nextStep") Создать концерт

                    v-window-item(value="place")
                        client-only
                            YandexMap#map(:coordinates="center" :zoom="16"   map-type="map" @click="mapClick")
                                YandexMarker(v-for="(place,i) of places" :coordinates="place.coordinate" :marker-id="`m${i}`" :key="i" @click="markerClick(place)")
                        div(vif="newConcert.place")
                            v-btn(@click="nextStep" color="primary") Далее

                    v-window-item(value="date")
                        v-date-picker(v-model="newDate" hide-header show-adjacent-months title="zzz" )
                        div(v-if="newDate")
                            h1 Вы выбрали {{moment(newDate).format('YYYY-MM-DD')}}
                            v-btn(@click="nextStep" color="primary") Далее

                    v-window-item(value="hour")
                        div.d-flex.flex-wrap
                            div.ma-2(v-for="hour of hours" :key="hour")
                                v-btn(@click="setHour(hour)" small :color="hour===newHour ? `primary` : ''") {{hour}}
                        h1 Вы выбрали {{moment.unix(newConcert.begin).format('YYYY-MM-DD HH:mm')}}
                        v-btn(v-if="newHour >= 0" @click="nextStep" color="primary") Далее

                    v-window-item(value="fin")
                        div.d-flex.justify-center
                            v-btn(color="primary" @click="addConcert") Создать
                h1 {{stepsResult()}}
                hr.my-3
                v-btn(v-if="step > 0" @click="step--") Вернуться


</template>

<style scoped lang="sass">
#map
    width: 100%
    height: 300px
    border: 1px solid red
</style>