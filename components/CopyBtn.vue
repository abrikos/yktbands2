<script setup lang="ts">
const props = defineProps<{ str: string }>()

function copy(){
    navigator.clipboard.writeText(props.str);
}
</script>

<template lang="pug">
v-tooltip(location="top" )
    template(v-slot:activator="{props}")
        v-btn(icon="mdi-clipboard" @click="copy" size="x-small" v-bind="props")
    span Копировать

</template>

<style scoped lang="sass">

</style>