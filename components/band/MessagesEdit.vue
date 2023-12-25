<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type { VDataTable } from 'vuetify/lib/components/index.mjs'
type ReadonlyHeaders = InstanceType<typeof VDataTable>['headers']
type SortItem = InstanceType<typeof VDataTable>['sortBy']

const {band} = defineProps<{ band: IBand }>()
const headers:ReadonlyHeaders = [
    {title:'Дата', key:'date'},
    {title:'Отправитель', key:'user.name'},
    {title:'Сообщение', key:'text'},
]
const sortBy:SortItem = [{ key: 'date', order: 'desc' }]
const search = ref()
</script>

<template lang="pug">
v-text-field(v-model="search" prepend-inner-icon="mdi-magnify" flat hide-details variant="solo-filled")
v-data-table(:headers="headers" :items="band.messages" v-model:sort-by="sortBy" v-model:search="search" )
</template>

<style scoped lang="sass">

</style>