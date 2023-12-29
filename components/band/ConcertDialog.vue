<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IConcert} from "~/server/models/concert.model";
import moment from "moment/moment";

const {data: places, refresh: refreshPlaces, pending: pendingPlaces} = await useNuxtApp().$GET('/place/all')// as unknown as IArtistResponse
const {band} = defineProps<{ band: IBand }>()
const showDialog = ref()
const concert = ref()
const hours = Array.from(Array(25).keys())

const {$event, $listen} = useNuxtApp()
$listen('concertDialog:show', (payload:IConcert) => {
    showDialog.value = true
    concert.value = payload
    concert.value.date = concert.value.date && new Date(concert.value.date)
})

const canCreate = computed(() => {
    if (!concert.value) return
    return concert.value.date && concert.value.place
})

async function upsertConcert(){
    const {data:place} = await useNuxtApp().$PUT(`/place/upsert`, concert.value.place)
    refreshPlaces()
    concert.value.place = place.value.id
    concert.value.band = band.id
    await useNuxtApp().$PUT(`/concert/upsert`, concert.value)
    showDialog.value = false
    concert.value = null
    $event('concerts:update')
}


</script>

<template lang="pug">
v-dialog(v-if="concert" v-model="showDialog" )
    v-card
        v-toolbar(color="primary")
            v-btn(icon="mdi-close" @click="showDialog=false")
            v-toolbar-title(v-if="!concert.id") Добавление концера
            v-toolbar-title(v-else) Редактирование концера
        v-card-text
            v-row
                v-col
                    h3 Ресторан
                    v-divider
                    small Для выбора существующего ресторана кликните по маркеру. Для создания нового - кликните по карте
                    div(v-if="!pendingPlaces")
                        BandLeafletEdit(:places="places" :concert="concert")
                            //template(v-slot:append-inner)
                                v-btn(v-if="concert.place?.id" @click="concert.place = {}" icon="mdi-cancel")
                    //div(v-if="!concert.place?.id && concert.place?.coordinate")
                        div {{concert?.place?.address}}
                        v-text-field(placeholder="Введите название нового ресторана" v-model="concert.place.name" variant="outlined" density="compact")
                            template(v-slot:append-inner)
                                v-btn(v-if="concert?.place?.name" @click="clearPlace" icon="mdi-cancel")

                v-col(cols="5")
                    v-row
                        v-col
                            h3 Дата {{concert?.date}}
                            v-divider
                            v-date-picker.picker(v-model="concert.date" hide-header="" show-adjacent-months="")
                        v-col
                            h3 Время
                            v-divider
                            div.d-flex.flex-wrap
                                div.ma-1(v-for="hour of hours" :key="hour")
                                    v-btn(@click="concert.hour = hour" 
                                        small :color="hour===concert.hour ? `secondary` : ''") {{hour > 9 ? hour : '0'+hour}}
                    v-divider
                    div.px-2
                        span.text-blue.px-1(v-if="concert?.place?.name") Ресторан "{{concert?.place.name.toUpperCase()}}",
                        span.text-red.px-1(v-if="!concert?.place?.name" ) Укажите название ресторана.
                        span.text-blue.px-1(v-if="concert?.place?.address") {{concert?.place.address}},
                        span.text-red.px-1(v-if="!concert?.place?.coordinate" ) Укажите адрес ресторана на карте.
                        span.text-blue.px-1(v-if="concert?.date")
                            span {{moment(concert?.date).format('YYYY-MM-DD')}} &nbsp;
                            span {{concert?.hour}}:00
                        span.text-red.px-1(v-if="!concert?.date" ) Укажите дату концерта.
                    v-divider
                    v-card-actions
                        v-spacer
                        v-btn(v-if="canCreate" @click="upsertConcert()" color="primary") Подтвердить
</template>

<style scoped lang="sass">

</style>