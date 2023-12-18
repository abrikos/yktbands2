<script setup lang="ts">
import type {PropType} from "vue";
import type {IBand} from "~/server/models/band.model";

const {$event} = useNuxtApp()
const props = defineProps<{ band: IBand }>()
const {band} = props
const edited = ref(false)

async function submit() {
    await useNuxtApp().$POST(`/my-band/update`, {...band})
    $event('band:refresh')
}

function reset() {
    $event('band:refresh');
    edited.value = false
}

const fullUrl = computed(()=>{
    return `${window.location.origin}/band-${band.id}`
})

</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Параметры
        v-divider(vertical inset)
        v-btn(@click="submit" color="primary" ) Сохранить
        v-btn(@click="reset") Сбросить
    v-card-text
        v-text-field(v-model="band.name" label="Название")
        v-text-field(v-model="band.logo" label="Логотип")
        v-text-field(v-model="band.poster" label="Постер")
        v-switch(v-model="band.enabled" label="Отображать для всех")
        a(:href="fullUrl" target="_blank") Перейти
        CopyBtn(:str="fullUrl")

</template>

<style scoped lang="sass">
//#preview
    transform: scale(.5)
    transform-origin: top left
</style>