<script setup lang="ts">
const {instrumentPosition} = useAppConfig()
const props = defineProps<{ icon: string }>()
</script>

<template lang="pug">
span.instrument(:style="instrumentPosition.find(o=>o.key===icon)")
</template>

<style scoped lang="sass">
.v-theme--dark
    .instrument
        filter: invert(1)

.instrument
    cursor: pointer
    //border: 1px solid red
    display: inline-block
    width: 50px
    height: 50px
    background-image: url('/instruments.png')
    //background-position: -20px -20px
    background-size: 150px
</style>