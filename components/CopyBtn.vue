<script setup lang="ts">
const {str, tooltip} = defineProps<{ str: string, tooltip?:string }>()

function copy(){
    navigator.clipboard.writeText(str);
}
</script>

<template lang="pug">
ButtonTooltip(icon="mdi-clipboard" :click="copy" :tooltip="tooltip || 'Копировать'" )
</template>

<style scoped lang="sass">

</style>