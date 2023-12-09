<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";

definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})
interface IBandBody {
    value:IBand
}
const route =useRoute()

const {data} = await useNuxtApp().$GET('/band/my-view/'+ route.params.id)// as  IBandBody
const item = ref(data.value)


</script>

<template lang="pug">
v-card {{item}}
</template>

<style scoped>

</style>