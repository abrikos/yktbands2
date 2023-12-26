<script setup lang="ts">
const route = useRoute()
const {$event} = useNuxtApp()
const {band} = defineProps<{ band: IBand }>()
const showColorPicker = ref('')

function togglePickers(picker:string){
    showColorPicker.value = picker
}
</script>

<template lang="pug">
v-switch(v-model="band.enabled" label="Отображать для всех")
v-text-field(v-model="band.name" label="Название")
v-text-field(v-model="band.logo" label="Логотип")
v-text-field(v-model="band.poster" label="Постер")
v-textarea(v-model="band.about" label="Описание")
v-row
    v-col
        v-btn(size="xs-small"  @click="togglePickers('text')") Цвет текста заголовка
            template(v-slot:prepend)
                v-icon(:color="band.colorText") mdi-home
        br
        v-btn(size="xs-small"   @click="togglePickers('banner')") Цвет банера
            template(v-slot:prepend)
                v-icon(:color="band.colorBanner") mdi-home

    v-col
        v-row(v-if="showColorPicker && showColorPicker!=='close'" )
            v-col(align-self="center" )
                h3(v-if="showColorPicker==='text'") Заголовок
                h3(v-if="showColorPicker==='banner'") Баннер
            v-col(cols="1")
                v-btn(icon="mdi-close" @click="togglePickers('close')")
        v-color-picker(v-if="showColorPicker==='text'" hide-inputs show-swatches v-model="band.colorText" )
        v-color-picker(v-if="showColorPicker==='banner'" hide-inputs show-swatches v-model="band.colorBanner" )


</template>

<style scoped lang="sass">
.color
    border: 1px solid white
    i
        border: 1px solid black
//#preview
    transform: scale(.5)
    transform-origin: top left
</style>