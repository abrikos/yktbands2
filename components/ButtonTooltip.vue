<script setup lang="ts">
defineProps<{ click?: Function, tooltip: string, icon: string, loading?:boolean, color?:string }>()
</script>

<template lang="pug">
v-tooltip(location="top" )
    template(v-slot:activator="{props}")
        v-btn(:icon="icon" @click="click" size="small" v-bind="props" :loading="loading" :color="icon==='mdi-delete'? 'red' : color||'primary'")
    span {{tooltip}}

</template>

<style scoped lang="sass">

</style>