<script setup lang="ts">
const {$GET, $POST, $PUT} = useNuxtApp()
const {data: users, refresh} = await $GET('/user')


//const users = ref([])
async function addUser() {
    await $PUT('/user', {email: 'aaa'})
    refresh()
}

async function getUsers() {
}

</script>

<template lang="pug">
v-card
    v-card-text
        div {{users}}
    v-card-actions
        v-spacer
        v-btn(@click="refresh" color="primary" ) GET
        v-btn(@click="addUser" color="warning" ) PUT

</template>

<style scoped>

</style>