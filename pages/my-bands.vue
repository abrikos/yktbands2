<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";

definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})

interface IBandArray {
    data: { value: [IBand] }
}

const {data} = await useNuxtApp().$GET('/band/my-list') as IBandArray
const list = ref(data.value)
const router = useRouter()

async function create() {
    const {data} = await useNuxtApp().$PUT('/band/create')
    const {id} = data.value as { id: string }
    await router.push(`/my-band-${id}`)
}
</script>

<template lang="pug">
v-card
    v-card-title Мои группы
    v-card-text
        v-btn(@click="create" color="primary") Создать
        v-list
            v-list-item(v-for="(item, i) of list" :key="i" @click="()=>router.push(`/my-band-${item.id}`)") {{item.name || item.shortcut}}
</template>

<style scoped>

</style>