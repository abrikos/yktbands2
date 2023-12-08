<script setup lang="ts">
const {$GET, $POST, $PUT} = useNuxtApp()
const user = ref({email: '1@1.com', password: '1'})
async function submit(){
    await $POST('/login', {...user.value})

}

</script>

<template lang="pug">
v-card
    v-card-text
        v-text-field(v-model="user.email" label="Email" )
        v-text-field(v-model="user.password" label="Пароль" type="password" )
    v-card-actions
        v-btn(@click="submit") Send
</template>

<style scoped>

</style>