<script setup lang="ts">
import type {IBand, IBandResponse} from "~/server/models/band.model";
import type {IPlace} from "~/server/models/place.model";
import moment from 'moment'
import type {IConcert} from "~/server/models/concert.model";
const props = defineProps<{ band: IBand }>()
const {band} = props
const route = useRoute()
const {$event, $listen} = useNuxtApp()
$listen('concertDialog:show', (concert) => {
    newConcert.value = concert as IConcert
    newConcert.value.date = new Date(newConcert.value.date)
    showDialog.value = true
})


const {data: places, refresh: refreshPlaces, pending: pendingPlaces} = await useNuxtApp().$GET('/place/all')// as unknown as IArtistResponse

const hours = Array.from(Array(25).keys())
const showDialog = ref()
const concertProto = {band, place: {id: '', name: '', address: '', coordinate: null}, hour: 20}
const newConcert = ref<IConcert>(concertProto as unknown as IConcert)

async function mapClick(e: any) {
    if (!newConcert.value) return
    const coordinate: [number, number] = [e.latlng.lat, e.latlng.lng]
    const {data} = await useNuxtApp().$POST('/concert/address', coordinate)
    newConcert.value.place = {id: '', address: data.value, coordinate} as IPlace
}

async function upsertConcert() {
    await useNuxtApp().$PUT('/concert/upsert', newConcert.value)
    await refreshPlaces()
    $event('concert:refresh');
}

function placeMarkerClick(place: IPlace) {
    if (!newConcert.value) return
    if (newConcert.value.place?.id === place.id) {
        newConcert.value.place = {} as IPlace
        return
    }
    newConcert.value.place = place
}

function placeCancel() {
    if (!newConcert.value) return
    newConcert.value.place = {} as IPlace
}

const errors = {coordinate: '', name: '', begin: ''}

const placeSearch = ref()
watch(placeSearch, (v) => {
    if (!newConcert.value) return
    newConcert.value.place = v
})

const canCreate = computed(() => {
    if (!newConcert.value) return
    return newConcert.value.date && (newConcert.value.place.id || (newConcert.value.place.name && newConcert.value.place.address && newConcert.value.place.coordinate))
})

function clearPlace() {
    if (!newConcert.value) return
    newConcert.value.place.name = ''
}
</script>

<template lang="pug">
div
    v-btn(v-if="!showDialog" @click="showDialog=true" color="primary" ) Добавить новый концерт
    v-dialog(v-if="showDialog" v-model="showDialog" transition="dialog-bottom-transition")
        v-card
            v-toolbar(color="primary")
                v-btn(icon="mdi-close" @click="newConcert = undefined; showDialog=false")
                v-toolbar-title(v-if="!newConcert.id") Добавление концера
                v-toolbar-title(v-else) Редактирование концера
            v-card-text
                v-row
                    v-col
                        h3 Ресторан
                        v-divider
                        small Для выбора существующего ресторана кликните по маркеру. Для создания нового - кликните по карте
                        div(v-if="!pendingPlaces")
                            BandLeaflet(:cancel="placeCancel" :map-click="mapClick" :new-concert="newConcert" :place-marker-click="placeMarkerClick" :places="places")

                            v-combobox(placeholder="Поиск ресторана" item-title="fullName" item-value="id" :items="places" v-model="placeSearch" density="compact" variant="outlined" )
                                template(v-slot:prepend-inner)
                                    v-icon mdi-magnify
                                //template(v-slot:append-inner)
                                    v-btn(v-if="newConcert.place?.id" @click="newConcert.place = {}" icon="mdi-cancel")
                        div(v-if="!newConcert?.place?.id && newConcert?.place?.coordinate")
                            div {{newConcert?.place?.address}}
                            v-text-field(placeholder="Введите название нового ресторана" v-model="newConcert.place.name" variant="outlined" density="compact")
                                template(v-slot:append-inner)
                                    v-btn(v-if="newConcert?.place?.name" @click="clearPlace" icon="mdi-cancel")

                    v-col(cols="5")
                        v-row
                            v-col
                                h3 Дата {{newConcert?.date}}
                                v-divider
                                v-date-picker.picker(v-model="newConcert.date" hide-header show-adjacent-months title="zzz")
                            v-col
                                h3 Время
                                v-divider
                                div.d-flex.flex-wrap
                                    div.ma-1(v-for="hour of hours" :key="hour")
                                        v-btn(@click="newConcert.hour = hour" small :color="hour===newConcert.hour ? `secondary` : ''") {{hour > 9 ? hour : '0'+hour}}
                        v-divider
                        div.px-2
                            span.text-blue.px-1(v-if="newConcert?.place?.name") Ресторан "{{newConcert?.place.name.toUpperCase()}}",
                            span.text-red.px-1(v-if="!newConcert?.place?.name" ) Укажите название ресторана.
                            span.text-blue.px-1(v-if="newConcert?.place?.address") {{newConcert?.place.address}},
                            span.text-red.px-1(v-if="!newConcert?.place?.coordinate" ) Укажите адрес ресторана на карте.
                            span.text-blue.px-1(v-if="newConcert?.date") {{moment(newConcert?.date).format('YYYY-MM-DD')}} {{newConcert?.hour}}:00
                            span.text-red.px-1(v-if="!newConcert?.date" ) Укажите дату концерта.
                        v-divider
                        v-card-actions
                            v-spacer
                            v-btn(v-if="canCreate" @click="upsertConcert();showDialog=false" color="primary") Сохранить
            v-card-actions
                v-spacer
                v-btn(@click="()=>{$event('band:refresh');showDialog=false}") Закрыть

</template>

<style scoped lang="sass">
</style>