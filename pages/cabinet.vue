<script setup lang="ts">
definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})
</script>

<template lang="pug">
v-card
    v-card-title Cabinet
</template>

<style scoped>

</style>