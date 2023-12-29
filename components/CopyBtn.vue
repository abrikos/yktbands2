<script setup lang="ts">
const {str, tooltip} = defineProps<{ str: string, tooltip?:string }>()

function copy(){
    navigator.clipboard.writeText(str);
}
</script>

<template lang="pug">
v-tooltip(location="top" )
    template(v-slot:activator="{props}")
        v-btn(icon="mdi-clipboard" @click="copy" size="x-small" v-bind="props")
    span {{tooltip || 'Копировать'}}

</template>

<style scoped lang="sass">

</style>