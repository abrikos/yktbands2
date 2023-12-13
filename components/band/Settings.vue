<script setup lang="ts">
import type {PropType} from "vue";
import type {IBand} from "~/server/models/band.model";
const { $event } = useNuxtApp()
const props = defineProps({
    band: {type: Object as PropType<IBand>, required: true}
})
const {band} = props
const edited = ref(false)

function submit() {
    useNuxtApp().$POST('/my-band/update/' + band.id, band)
}

function reset(){
    $event('band:refresh');
    edited.value=false
}

</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Параметры
    v-card-text
        v-text-field(v-model="band.name" label="Название" v-on:keyup="edited=true" density="compact" )
        v-text-field(v-model="band.shortcut" label="Уникальный путь"  density="compact"  hint="Используется для создания уникальной ссылки на страницу коллектива. Только цифры, английские символыи нижнее подчеркивание" persistent-hint  v-on:keyup="edited=true" )
        v-switch(v-model="band.enabled" label="Отображать для всех" v-on:change="edited=true")
    v-card-actions(v-if="edited")
        v-btn(@click="submit") Сохранить
        v-spacer
        v-btn(@click="reset") Сбросить

</template>

<style scoped>

</style>