<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {VDataTable} from 'vuetify/lib/components/index.mjs'
import type {IMessage} from "~/server/models/message.model";

type ReadonlyHeaders = InstanceType<typeof VDataTable>['headers']
type SortItem = InstanceType<typeof VDataTable>['sortBy']

const {band} = defineProps<{ band: IBand }>()
const headers: ReadonlyHeaders = [
    {title: 'Дата', key: 'date'},
    {title: 'Отправитель', key: 'user.name'},
    {title: 'Сообщение', key: 'text'},
    {title: '', key: 'action'},
]
const sortBy: SortItem = [{key: 'date', order: 'desc'}]
const search = ref()

async function deleteMessage(item: IMessage) {
    if (!confirm(`Удалить сообщение от ${item.user.name}: ${item.text}`)) return
    await useNuxtApp().$DELETE(`/message/${item.id}`)
    band.messages = band.messages.filter(m => m.id !== item.id)
}
</script>

<template lang="pug">
div
    v-text-field(v-model="search" prepend-inner-icon="mdi-magnify" flat hide-details variant="solo-filled")
    v-data-table(:headers="headers" :items="band.messages" v-model:sort-by="sortBy" v-model:search="search" )
        template(v-slot:item.action="{item}")
            v-btn(icon="mdi-delete" size="xs-small" @click="deleteMessage(item)" color="red")
</template>

<style scoped lang="sass">

</style>