<script setup lang="ts">
import {useAuthStore} from '~/store/auth-store';
import type {IUser} from "~/server/models/user.model";
import {storeToRefs} from "pinia";

const {loggedUser} = storeToRefs(useAuthStore()) as unknown as { loggedUser: IUser }

const password = ref()
const password2 = ref()
const canSubmit = () => {
    return password.value && password.value === password2.value
}

async function changePassword() {
    await useNuxtApp().$POST('/user/password', {password: password.value})
    password2.value = undefined
    password.value = undefined
}


</script>

<template lang="pug">
v-card(v-if="!loggedUser.strategy" width="600" )
    v-card-title  Смена пароля
    v-card-text
        v-text-field(v-model="password" label="Новый пароль" type="password")
        v-text-field(v-model="password2" label="Подтверждение пароля" type="password" :rules="[() => password === password2 || 'Пароль и подтверждение должны совпадать']")
    v-card-actions(v-if="canSubmit()")
        v-btn(@click="changePassword") Сохранить

</template>

<style scoped lang="sass">
</style>