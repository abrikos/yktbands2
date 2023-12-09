<script setup lang="ts">
definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})
const {data, refresh} = await useNuxtApp().$GET('/band/my-list')
const list = ref(data.value)

async function create(){
    const {data} = await useNuxtApp().$PUT('/band/create')
    console.log(data.value)
    refresh()
}
</script>

<template lang="pug">
v-card
    v-card-title Мои группы
    v-card-text {{list}}
        v-btn(@click="create") Создать
</template>

<style scoped>

</style>