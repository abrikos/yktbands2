<script setup lang="ts">
import type {VDataTable} from "vuetify/components";

const {model, headers} = defineProps<{ model: string, headers: string[] }>()
type ReadonlyHeaders = InstanceType<typeof VDataTable>['headers']
type SortItem = InstanceType<typeof VDataTable>['sortBy']
const {data: items, refresh} = await useNuxtApp().$GET(`/${model}/admin-all`)
const tableHeaders: ReadonlyHeaders = [...headers.map(h => ({title: h, key: h})), {key: 'action'}]


const search = ref()
const sortBy: SortItem = [{key: 'date', order: 'desc'}]

async function deleteItem(item: any) {
    if(!window.confirm(`Удалить ${model} "${item[headers[0]]}"?`)) return
    await useNuxtApp().$DELETE(`/${model}/${item.id}`)
    refresh()
}

</script>

<template lang="pug">
v-card
    v-card-title {{model.toUpperCase()}}
    v-card-text
        v-text-field(v-model="search" prepend-inner-icon="mdi-magnify" flat hide-details variant="solo-filled")
        v-data-table(:headers="tableHeaders" :items="items" v-model:sort-by="sortBy" v-model:search="search")
            template(v-slot:item.action="{item}")
                v-btn(icon="mdi-delete" color="red" size="x-small" @click="deleteItem(item)")
</template>

<style scoped lang="sass">

</style>