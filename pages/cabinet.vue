<script setup lang="ts">
import {storeToRefs} from 'pinia'; // import storeToRefs helper hook from pinia
import {useAuthStore} from '~/store/auth-store'; // import the auth store we just created
const {user} = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const password = ref('')
const password2 = ref('')
const canSubmit = ()=> {
    return password.value && password.value === password2.value
}

definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})

async function submit() {
    await useNuxtApp().$POST('/user/update', user)
}
async function changePassword() {
    await useNuxtApp().$POST('/user/password', {password})
}
</script>

<template lang="pug">
div
    div(v-if="user")
        v-card
            v-card-title Профиль
            v-card-text
                img.avatar(:src="`/${user.strategy}.svg`" v-if="user.strategy" )
                v-text-field(v-model="user.email" label="Email" disabled v-if="!user.strategy")
                v-text-field(v-model="user.name" label="Имя")
                v-text-field(v-model="user.photo" label="Фото")
                img.avatar(:src="user.photo" onerror="this.src='/avatar.png'")
            v-card-actions
                v-btn(@click="submit") Сохранить
        br
        v-card(v-if="!user.strategy")
            v-card-title Пароль
            v-card-text
                v-text-field(v-model="password" label="Пароль" type="password")
                v-text-field(v-model="password2" label="Подтверждение пароля" type="password" :rules="[() => user.password === password2 || 'Пароль и подтверждение должны совпадать']")
            v-card-actions
                v-btn(@click="changePassword" v-if="canSubmit()") Сохранить

</template>

<style scoped lang="sass">
.avatar
    width: 50px
</style>