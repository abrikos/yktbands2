<script setup lang="ts">
import { useAuthStore } from '~/store/auth-store'; // import the auth store we just created

const { signupUser } = useAuthStore(); // use authenticateUser action from  auth store

//const user = ref({email: Math.random()+'@c.c', password: '1'})
//const password2 = ref('1')
const user = ref({email: '', password: ''})
const password2 = ref()
const canSubmit = ()=>user.value.email && user.value.password && user.value.password === password2.value
async function submit(){
    if(!canSubmit) return
    await signupUser(user.value)
}
</script>


<template lang="pug">
div.d-flex.align-center.flex-column
    v-card(width="600" )
        v-card-text
            v-text-field(v-model="user.email" label="Email" :rules="[() => !!user.email || 'Это поле обязательно']")
            v-text-field(v-model="user.password" label="Пароль" type="password")
            v-text-field(v-model="password2" label="Подтверждение пароля" type="password" :rules="[() => user.password === password2 || 'Пароль и подтверждение должны совпадать']")
        v-card-actions
            v-btn(@click="submit" v-if="canSubmit()") Зарегистрировать
</template>

<style scoped>

</style>