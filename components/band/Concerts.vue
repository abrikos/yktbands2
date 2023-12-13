<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IPlace} from "~/server/models/place.model";

const props = defineProps<{ band: IBand}>()
const {$event, $listen} = useNuxtApp()
$listen('dialog:close', () => showDialog.value = false)

const showDialog = ref()

async function deleteConcert() {
    $event('band:refresh')
}

</script>

<template lang="pug">
div
    v-row
        v-col(cols="4")
            v-card

                v-card-text
                    ul
                        li(v-for="(concert,i) of band.concerts" :key="i") {{i}} {{concert.place?.name}} {{concert.place?.address}} {{concert.date}}
                            v-btn(@click="deleteConcert") del
        v-col
            v-btn(@click="showDialog=true" color="primary" ) Добавить новый концерт
            v-dialog(v-model="showDialog" xfullscreen  transition="dialog-bottom-transition")
                v-card
                    v-toolbar(color="primary")
                        v-btn(icon="mdi-close" @click="showDialog=false")
                        v-toolbar-title Добавление концера
                    v-card-text
                            BandPlace(:band="band")
                    v-card-actions
                        v-spacer
                        v-btn(@click="showDialog=false") Закрыть

</template>

<style scoped lang="sass">
</style>