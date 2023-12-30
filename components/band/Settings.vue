<script setup lang="ts">
const route = useRoute()
const {$event} = useNuxtApp()
const {band} = defineProps<{ band: IBand }>()
const showColorPicker = ref('')

const input = ref()
const loading = ref()

function togglePickers(picker:string){
    showColorPicker.value = picker
}

async function upload(e: any) {
    loading.value = true
    const formData = new FormData()
    for (const file of e.target.files)
        formData.append('photo', file)
    const photos = await useNuxtApp().$PUT(`/photo/band/${band.id}/upload`, formData)
    input.value.value = null
    band.photos = photos
    loading.value = false
}

function choosePhoto(type:string){
    band[type] = 'https://i.ibb.co/vj6DK50/lisa-circle.png'
}

</script>

<template lang="pug">
div
    v-switch(v-model="band.enabled" label="Отображать для всех")
    v-text-field(v-model="band.name" label="Название")
    input(type="file" ref="input" @change="upload" hidden multiple)
    v-btn(@click="choosePhoto('logo')" :loading="loading") Загрузить лого
    v-btn(@click="choosePhoto('poster')" :loading="loading") Загрузить постер

    v-text-field(v-model="band.logo" label="Логотип")
    v-text-field(v-model="band.poster" label="Постер")
    v-textarea(v-model="band.about" label="Описание")

    v-dialog(width="500")
        template(v-slot:activator="{props}")
            v-btn(size="xs-small" v-bind="props"  @click="togglePickers('text')") Цвет текста заголовка
                template(v-slot:prepend)
                    v-icon(:color="band.colorText") mdi-home
            br
            v-btn(size="xs-small" v-bind="props"  @click="togglePickers('banner')") Цвет банера
                template(v-slot:prepend)
                    v-icon(:color="band.colorBanner") mdi-home
        template( v-slot:default="{isActive}")
            v-card
                v-toolbar
                    v-toolbar-title
                        span(v-if="showColorPicker==='text'") Заголовок
                        span(v-if="showColorPicker==='banner'") Баннер
                    v-spacer
                    //v-divider(vertical="" )

                    v-btn(icon="mdi-close" @click="isActive.value=false")
                v-card-text
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