<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";

const {band} = defineProps<{ band: IBand }>()
const {origin} = useRequestURL()
const shareUrl = computed(() => {
    return `${origin}/share-${band.id}-${band.shareCode}`
})
const shareCode = ref()

function createShare() {
    band.shareCode = Math.random().toString()
    console.log(band.shareCode)
}

function cancelShare() {
    band.shareCode = ''
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
        v-list(item-props :items="band.shares.map(u=>{u.prependAvatar = u.avatarImage; return u})" item-value="id"
            item-title="name")
        //div {{band.shares.map(u=>{u.prependAvatar = u.avatarImage; return u.avatarImage})}}

</template>

<style scoped lang="sass">

</style>