<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";

definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})

interface IBandArray {
    data: { value: [IBand] }
}

const {data} = await useNuxtApp().$GET('/my-band/all')
const list = data.value as IBand[]
const router = useRouter()

async function create() {
    const {data} = await useNuxtApp().$PUT('/my-band/create')
    await router.push(data.value.editLink)
}
</script>

<template lang="pug">
v-card(width="600" )
    v-toolbar
        v-toolbar-title Мои группы
        v-divider(vertical inset)
        v-btn(@click="create" color="primary") Создать
    v-card-text
        v-list
            v-list-item(v-for="(item, i) of list" :key="i" @click="()=>router.push(item.editLink)") {{item.name || item.id}}
</template>

<style scoped>

</style>