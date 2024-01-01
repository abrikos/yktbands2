<script setup lang="ts">
const {click, tooltip, icon} = defineProps<{ click: Function, tooltip: string, icon: string }>()

</script>

<template lang="pug">
v-tooltip(location="top" )
    template(v-slot:activator="{props}")
        v-btn(:icon="icon" @click="click" size="small" v-bind="props")
    span {{tooltip}}

</template>

<style scoped lang="sass">

</style>