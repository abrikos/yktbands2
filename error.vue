<script setup lang="ts">
const props = defineProps({
    error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template lang="pug">
NuxtLayout
    h1.text-red {{error.statusCode}} {{ error.message }}
    div(v-if="![403].includes(error.statusCode)" v-html="error.stack" )
    v-btn( @click="handleError") Вернуться на сайт

</template>