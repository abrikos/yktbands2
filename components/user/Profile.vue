<script setup lang="ts">
import {useAuthStore} from '~/store/auth-store';
import type {IUser} from "~/server/models/user.model";
import {storeToRefs} from "pinia";

const {loggedUser} = storeToRefs(useAuthStore()) as unknown as { loggedUser: IUser }

async function submit() {
    await useNuxtApp().$POST('/user/update', loggedUser)
    snapshot()
}

const userSnapshot = ref<IUser>(loggedUser && JSON.parse(JSON.stringify(loggedUser.value)))
const edited = computed(() => {
    return loggedUser && JSON.stringify(userSnapshot.value) !== JSON.stringify(loggedUser.value)
})

function reset() {
    for (const key in loggedUser.value) {
        loggedUser.value[key] = userSnapshot.value[key]
    }
}

function snapshot() {
    for (const key in loggedUser.value) {
        userSnapshot.value[key] = loggedUser.value[key]
    }
}



</script>

<template lang="pug">
v-card(width="600" )
    v-card-title  Профиль
        img.strategy(v-if="loggedUser.strategy" :src="`/${loggedUser.strategy}.svg`")
    v-card-text
        v-text-field(
            v-model="loggedUser.email"
            label="Адрес почты"
            :disabled="!loggedUser.strategy"
            :error-messages="loggedUser.strategy && loggedUser.email.match(loggedUser.strategy) ? [`Измените e-mail. Он необходим для получения сообщений в вашей группе`]:[]"
        )
        v-text-field(v-model="loggedUser.avatarImage" label="Фото")
            template(v-slot:append-inner)
                //v-fade-transition
                UserAvatar(:user="loggedUser" )
        v-text-field(v-model="loggedUser.name" label="Имя")
    v-card-actions(v-if="edited")
        v-btn(@click="submit" color="primary" ) Сохранить
        v-spacer
        v-btn(@click="reset") Сбросить
</template>

<style scoped lang="sass">
img.strategy
    //transform: translate(7px, 3px)
    height: 20px
</style>