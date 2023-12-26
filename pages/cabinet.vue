<script setup lang="ts">
import {useAuthStore} from '~/store/auth-store';
import type {IUser} from "~/server/models/user.model"; // import the auth store we just created
const {loggedUser} = useAuthStore() as { loggedUser: IUser }; // make authenticated state reactive with storeToRefs

const password = ref()
const password2 = ref()
const tab = ref()
const canSubmit = () => {
    return password.value && password.value === password2.value
}

async function submit() {
    await useNuxtApp().$POST('/user/update', loggedUser)
}

async function changePassword() {
    await useNuxtApp().$POST('/user/password', {password: password.value})
    password2.value = undefined
    password.value = undefined
}


</script>

<template lang="pug">
div(v-if="loggedUser")
    v-toolbar
        v-toolbar-title  Кабинет
    v-tabs(v-model="tab")
        v-tab(value="1" ) Профиль
        v-tab(value="2" ) Смена пароля
    div.d-flex.align-center.flex-column
    v-window(v-model="tab" )

        v-window-item(value="1" )
            v-card(width="600" )
                v-card-title  Профиль
                    img.strategy(v-if="loggedUser.strategy" :src="`/${loggedUser.strategy}.svg`")
                v-card-text
                    v-text-field(
                        v-model="loggedUser.email"
                        label="Email"
                        :disabled="!loggedUser.strategy"
                        :error-messages="loggedUser.strategy && loggedUser.email.match(loggedUser.strategy) ? [`Измените e-mail. Он необходим для получения сообщений в вашей группе`]:[]"
                    )
                    v-text-field(v-model="loggedUser.name" label="Имя")
                    v-text-field(v-model="loggedUser.avatarImage" label="Фото")
                        template(v-slot:append-inner)
                            //v-fade-transition
                            UserAvatar(:user="loggedUser" )
                v-card-actions
                    v-btn(@click="submit") Сохранить

        v-window-item(value="2" )
            v-card(v-if="!loggedUser.strategy" width="600" )
                v-card-title  Смена пароля
                v-card-text
                    v-text-field(v-model="password" label="Новый пароль" type="password")
                    v-text-field(v-model="password2" label="Подтверждение пароля" type="password" :rules="[() => password === password2 || 'Пароль и подтверждение должны совпадать']")
                v-card-actions
                    v-btn(@click="changePassword" v-if="canSubmit()") Сохранить

</template>

<style scoped lang="sass">
img.strategy
    //transform: translate(7px, 3px)
    height: 20px
</style>