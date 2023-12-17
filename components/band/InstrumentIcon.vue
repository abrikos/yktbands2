<script setup lang="ts">

const instrumentPosition = {
    guitar: {backgroundPosition: '0 0'},
    piano: {backgroundPosition: '0 -46px'},
    drum: {backgroundPosition: '0 -94px'},

    bass: {backgroundPosition: '-50px 0'},
    vocal: {backgroundPosition: '-50px -46px'},
    keyboard: {backgroundPosition: '-50px -94px'},

    violin: {backgroundPosition: '-100px 0'},
    trump: {backgroundPosition: '-100px -48px'},
    mixer: {backgroundPosition: '-100px -94px'},
}


const props = defineProps<{ icon: string }>()
</script>

<template lang="pug">
span.instrument(:style="instrumentPosition[icon]")
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