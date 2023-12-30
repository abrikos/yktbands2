<script setup lang="ts">
import type {VDataTable} from "vuetify/components";

const {model, headers} = defineProps<{ model: string, headers: string[], buttons?: { icon: string, onClick: Function, tooltip: string }[] }>()
type ReadonlyHeaders = InstanceType<typeof VDataTable>['headers']
type SortItem = InstanceType<typeof VDataTable>['sortBy']
const {data: items, refresh} = await useNuxtApp().$GET(`/${model}/admin-all`)
const tableHeaders: ReadonlyHeaders = [...headers.map(h => ({title: h, key: h})), {key: 'action'}]


const search = ref()
const sortBy: SortItem = [{key: 'date', order: 'desc'}]

function parseField(h:string, item:any){
    const split = h.split('.')
    if(split.length>1){
        let obj = item
        for(const f of split){
            obj = obj[f]
        }
        return obj
    }
    return item[h]
}

async function deleteItem(item: any) {
    const data = headers.map(h=> parseField(h,item)).join(', ')
    if (!window.confirm(`Удалить ${model} "${data}"?`)) return
    await useNuxtApp().$DELETE(`/${model}/${item.id}`)
    refresh()
}

async function additionalBtnClick(btn: any, item: any) {
    await btn.onClick(item)
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
                //v-btn(v-for="btn of buttons" :key="btn.icon" :icon="btn.icon" @click="additionalBtnClick(btn, item)")
                v-tooltip(location="top" v-for="btn of buttons" :key="btn.icon")
                    template(v-slot:activator="{props}")
                        v-btn(:icon="btn.icon" @click="additionalBtnClick(btn, item)" size="small" v-bind="props")
                    span {{btn.tooltip}}

</template>

<style scoped lang="sass">

</style>