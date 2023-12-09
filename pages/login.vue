<script setup lang="ts">
import { useAuthStore } from '~/store/auth-store';
const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store

const user = ref({email: '1@1.com', password: '1'})
async function submit(){
    await authenticateUser(user.value)
}

</script>

<template lang="pug">
v-card
    v-card-text
        v-text-field(v-model="user.email" label="Email" )
        v-text-field(v-model="user.password" label="Пароль" type="password" )
    v-card-actions
        v-btn(@click="submit") Send
        TelegramLogin
</template>

<style scoped>

</style>