<script setup lang="ts">
const props = defineProps({
    error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template lang="pug">
NuxtLayout
    h1.text-red {{error.statusCode}} {{ error.message }}
    div(v-html="error.stack" )
    v-btn( @click="handleError") Clear errors

</template>