<script setup lang="ts">
import {storeToRefs} from 'pinia'; // import storeToRefs helper hook from pinia
import {useAuthStore} from '~/store/authStore'; // import the auth store we just created
const {loggedUser} = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const password = ref()
const password2 = ref()
const canSubmit = ()=> {
    return password.value && password.value === password2.value
}

definePageMeta({
    middleware: 'auth-middleware' // this should match the name of the file inside the middleware directory
})

async function submit() {
    await useNuxtApp().$POST('/user/update', loggedUser)
}
async function changePassword() {
    await useNuxtApp().$POST('/user/password', {password})
    password2.value = undefined
    password.value = undefined
}
</script>

<template lang="pug">
div
    div(v-if="loggedUser")
        v-card
            v-card-title Профиль
            v-card-text
                img.avatar(:src="`/${loggedUser.strategy}.svg`" v-if="loggedUser.strategy" )
                v-text-field(v-model="loggedUser.email" label="Email" disabled v-if="!loggedUser.strategy")
                v-text-field(v-model="loggedUser.name" label="Имя")
                v-text-field(v-model="loggedUser.photo" label="Фото")
                    template(v-slot:append-inner)
                        //v-fade-transition
                        UserAvatar(:user="loggedUser" )
            v-card-actions
                v-btn(@click="submit") Сохранить
        br
        v-card(v-if="!loggedUser.strategy")
            v-card-title Пароль
            v-card-text
                v-text-field(v-model="password" label="Пароль" type="password")
                v-text-field(v-model="password2" label="Подтверждение пароля" type="password" :rules="[() => password === password2 || 'Пароль и подтверждение должны совпадать']")
            v-card-actions
                v-btn(@click="changePassword" v-if="canSubmit()") Сохранить

</template>

<style scoped>

</style>