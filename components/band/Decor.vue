<script setup lang="ts">
const uploadInput = ref()
async function upload(){
    console.log('zzzz', uploadInput.value)
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
        input(type="file" ref="uploadInput")
        v-btn(:click="upload") Загрузить лого
        v-btn(:click="upload") Загрузить постер
</template>

<style scoped>

</style>