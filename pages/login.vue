<script setup lang="ts">
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth-store'; // import the auth store we just created

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

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
</template>

<style scoped>

</style>