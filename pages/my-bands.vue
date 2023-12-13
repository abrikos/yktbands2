<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";

definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})

interface IBandArray {
    data: { value: [IBand] }
}

const {data} = await useNuxtApp().$GET('/my-band/all') as IBandArray
const list = ref(data.value)
const router = useRouter()

async function create() {
    const {data} = await useNuxtApp().$PUT('/my-band/create')
    const {id} = data.value as { id: string }
    await router.push(`/my-band-${id}`)
}
</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Мои группы
        v-divider(vertical inset)
        v-btn(@click="create" color="primary") Создать
    v-card-text

        v-list
            v-list-item(v-for="(item, i) of list" :key="i" @click="()=>router.push(`/my-band-${item.id}`)") {{item.nameOrShortcut}}
</template>

<style scoped>

</style>