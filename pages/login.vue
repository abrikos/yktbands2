<script setup lang="ts">
import { useAuthStore } from '~/store/authStore';
const { authenticateUser, loggedUser } = useAuthStore(); // use authenticateUser action from  auth store
const route = useRouter()
if(loggedUser) route.push('/cabinet')
const user = ref({email: 'abrikoz@gmail.com', password: '1'})
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
        //LoginTelegram
</template>

<style scoped>

</style>