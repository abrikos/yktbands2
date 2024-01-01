<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import type {IUser} from "~/server/models/user.model";

const {band} = defineProps<{ band: IBand }>()
const {origin} = useRequestURL()
const {$event} = useNuxtApp()
const shareUrl = computed(() => {
    return `${origin}/share-${band.id}-${band.shareCode}`
})
const shareCode = ref()

function createShare() {
    band.shareCode = Math.random().toString()
    $event('my-band:update')
}

function cancelShare() {
    band.shareCode = ''
    $event('my-band:update')

}

function deleteAdmin(user: IUser) {
    band.shares = band.shares.filter(u => u.id !== user.id)
    $event('my-band:update')
}

const messages = ['Передайте ссылку тому, кому хотите дать права администратора группы', 'Ссылка доступна только для подключения одного юзера']

</script>

<template lang="pug">
div
    div(v-if="band.shareCode" )
        v-text-field(:value="shareUrl" :messages="messages")
            template(v-slot:append-inner)
                CopyBtn(:str="shareUrl")
                v-tooltip(location="top" )
                    template(v-slot:activator="{props}")
                        v-btn(@click="cancelShare" icon="mdi-close" color="red" size="xs-small" v-bind="props")
                    span Отменить доступ

    v-btn(v-else @click="createShare" color="primary" ) Дать доступ к группе
    v-card-title Имеют права администратора
    v-card-text
        v-row(v-for="(user,i) of band.shares" :key="i" align="center" )
            v-col(cols="1")
                UserAvatar(:user="user")
            v-col {{user.name}}
            v-col(cols="2")
                ButtonTooltip(icon="mdi-delete" :click="()=>deleteAdmin(user)" tooltip="Удалить")

</template>

<style scoped lang="sass">

</style>