<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IMessage} from "~/server/models/message.model";
import moment from "moment";
import {useAuthStore} from "~/store/auth-store";
import type {IUser} from "~/server/models/user.model";

const {getUser} = useAuthStore();
const loggedUser = await getUser()
const maxLength = 500

const {band} = defineProps<{ band: IBand }>()
const {$event} = useNuxtApp()
const text = ref('')
const loading =ref()
async function submit() {
    const body = {text: text.value} as IMessage
    loading.value = true
    const {data: message} = await useNuxtApp().$PUT(`/band/${band.id}/message`, body)
    //body.date = moment().format('YYYY-MM-DD MM:mm')
    //body.user = {name: loggedUser.name, avatarImage: loggedUser.photo} as IUser
    band.messages.push(message.value)
    text.value = ''
    loading.value = false
}

const validTextLength = computed(() => text.value.length <= maxLength)

const validate = [
    (v: string | boolean) => {
        return validTextLength.value || `Превышена максимальная длинна сообщения ${maxLength} символов. (${text.value.length})`
    }
]
</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Сообщения {{band.messages.length}}
    v-card-text
        div.chat
            div
                div(v-for="(message, i) of band.messages" :key="i" )
                    div.d-flex.justify-end.align-center.text-blue
                        span.px-2 {{message.user.name}}
                        UserAvatar(:user="message.user")
                        span {{message.date}}

                    div {{message.text}}
        div(v-if="loggedUser") {{validTextLength}}
            v-textarea(v-model="text" :rules="validate" placeholder="Введите текст сообщения")#input
            v-btn(v-if="validTextLength" @click="submit" :loading="loading") Отправить {{text.length}} символов
        div(v-else).text-red Сообщения могут отправлять только зарегистрированные пользователи &nbsp;
            NuxtLink(to="/login") Войти
</template>

<style scoped lang="sass">
textarea
    margin-top: 10px
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity))
    padding: 10px
    width: 100%
    height: 100px
    font-size: .9em !important
.chat
    height: 200px
    overflow-y: scroll
    display: flex
    flex-direction: column-reverse
</style>