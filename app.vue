<script lang="ts" setup>
const {$GET, $POST, $PUT} = useNuxtApp()
const {data} = await $GET('/users')

async function addUser() {
    await $PUT('/user', {email: 'aaa'})
}

</script>
<template lang="pug">
v-app
    v-main
        v-container
            v-btn(@click="addUser") PUT
</template>
