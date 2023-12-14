<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";

const uploadInput = ref()
const props = defineProps<{ band: IBand }>()
const {band} = props
const type = ref()
const imgRnd = ref()

async function upload(e:Event){
    const {files} = e.target as HTMLInputElement
    const file = (files? files[0] : null) as Blob
    const form = new FormData
    form.append('file',file)
    form.append('type',type.value)
    const{pending} = await useNuxtApp().$POST(`/my-band/${band.id}/upload`,form, true)
    imgRnd.value = Math.random()
    uploadInput.value.value = null
}

function chooseFile(t:string){
    type.value = t
    uploadInput.value.click()
}
</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Оформление
        v-divider.mx-4(vertical inset)
        v-btn Button

    v-card-text
        input.d-none(type="file" ref="uploadInput" @change="upload")
        v-btn(@click="chooseFile('logo')") Загрузить лого
        v-btn(@click="chooseFile('poster')") Загрузить постер
        v-divider
        v-row
            v-col
                img.logo(:src="`/upload/logo_${band.id}.png?r=${imgRnd}`" onerror="this.src='/logo.svg'")
            v-col
                img.poster(:src="`/upload/poster_${band.id}.png?r=${imgRnd}`" onerror="this.src='/logo.svg'")

</template>

<style scoped lang="sass">
img
    max-width: 100px
    max-height: 100px
</style>