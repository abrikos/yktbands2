<script setup lang="ts">
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth-store'; // import the auth store we just created

const { signupUser } = useAuthStore(); // use authenticateUser action from  auth store
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const user = ref({email: '12@1.com', password: '1'})
const password2 = ref('1')
const canSubmit = ()=>user.value.password === password2.value
async function submit(){
    if(!canSubmit) return
    await signupUser(user.value)
}
</script>


<template lang="pug">
v-card
    v-card-text
        v-text-field(v-model="user.email" label="Email" :rules="[() => !!user.email || 'Это поле обязательно']")
        v-text-field(v-model="user.password" label="Пароль" type="password")
        v-text-field(v-model="password2" label="Подтверждение пароля" type="password" :rules="[() => user.password === password2 || 'Пароль и подтверждение должны совпадать']")
    v-card-actions
        v-btn(@click="submit" v-if="canSubmit()") Send
</template>

<style scoped>

</style>