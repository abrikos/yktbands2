<script setup lang="ts">
import PhotoUpload from "~/components/band/PhotoUpload.vue";
import type {IBand} from "~/server/models/band.model";

const route = useRoute()
const {$event} = useNuxtApp()
const {band} = defineProps<{ band: IBand }>()

async function reset() {
    await $event('my-band:refresh')
}


async function submit() {
    await $event('my-band:update')
}


</script>

<template lang="pug">
div
    v-switch(v-model="band.enabled" label="Отображать для всех")
    v-text-field(v-model="band.name" label="Название")
    v-row
        v-col
            PhotoUpload(:band="band" type="logo" )
        v-col
            PhotoUpload(:band="band" type="poster" )
    //v-text-field(v-model="band.logo" label="Логотип")
    //v-text-field(v-model="band.poster" label="Постер")
    v-textarea(v-model="band.about" label="Описание")

    v-text-field(v-model="band.colorText" label="Цвет текста" )
        template(v-slot:append)
            v-menu(:close-on-content-click="false")
                template(v-slot:activator="{ props }")
                    v-btn(:color="band.colorText" v-bind="props" icon="mdi-eyedropper-variant")
                v-card
                    v-card-text
                        v-color-picker(hide-inputs show-swatches v-model="band.colorText")
    v-text-field(v-model="band.colorBanner" label="Цвет банера" )
        template(v-slot:append)
            v-menu(:close-on-content-click="false")
                template(v-slot:activator="{ props }")
                    v-btn(v-bind="props" icon="mdi-eyedropper-variant" :color="band.colorBanner")

                v-card
                    v-card-text
                        v-color-picker(hide-inputs show-swatches v-model="band.colorBanner")

v-card-actions
    v-btn(@click="submit" color="primary" active="" ) Сохранить
    v-spacer
    v-btn(@click="reset") Сбросить

</template>

<style scoped lang="sass">
.action
    border-bottom: 1px solid red

</style>