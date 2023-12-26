<script setup lang="ts">
const route = useRoute()
const {$event} = useNuxtApp()
const {band} = defineProps<{ band: IBand }>()
const showColorText = ref()
const showColorBanner = ref()

function togglePickers(picker:string){
    if(picker==='text'){
        showColorText.value = !showColorText.value
        showColorBanner.value = false
    }else{
        showColorText.value = false
        showColorBanner.value = !showColorBanner.value

    }
}
</script>

<template lang="pug">
v-switch(v-model="band.enabled" label="Отображать для всех")
v-text-field(v-model="band.name" label="Название")
v-text-field(v-model="band.logo" label="Логотип")
v-text-field(v-model="band.poster" label="Постер")
v-row
    v-col
        span.color
            v-icon(:color="band.colorText") mdi-home
        v-btn(size="xs-small"  @click="togglePickers('text')") Цвет текста заголовка
        br
        span.color
            v-icon(:color="band.colorBanner") mdi-home
        v-btn(size="xs-small"   @click="togglePickers('banner')") Цвет банера
    v-col
        h3(v-if="showColorText") Заголовок
        h3(v-if="showColorBanner") Баннер
        v-color-picker(v-if="showColorText" hide-inputs show-swatches v-model="band.colorText" )
        v-color-picker(v-if="showColorBanner" hide-inputs show-swatches v-model="band.colorBanner" )


</template>

<style scoped lang="sass">
.color
    background-color: white
//#preview
    transform: scale(.5)
    transform-origin: top left
</style>