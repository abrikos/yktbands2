<script setup lang="ts">
const {band} = defineProps<{ band: IBand }>()
const {origin} = useRequestURL()
const shareUrl = computed(() => {
    return `${origin}/share-${band.id}-${band.shareCode}`
})
const shareCode = ref()
function createShare() {
    band.shareCode = Math.random().toString()
}
function cancelShare() {
    band.shareCode = ''
}

</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Доступ к редактированию группы
    v-card-text
        div(v-if="band.shareCode" )
            div Ссылка доступна только для подключения одного юзера
            div {{shareUrl}}
                CopyBtn(:str="shareUrl")
            v-btn(@click="cancelShare") Отменить доступ
        v-btn(v-else @click="createShare") Дать доступ к группе
    v-card-title Имеют доступ
    v-card-text
        v-list(item-props :items="band.shares.map(u=>{u.prependAvatar = u.avatarImage; return u})" item-value="id"
            item-title="name")
        //div {{band.shares.map(u=>{u.prependAvatar = u.avatarImage; return u.avatarImage})}}

</template>

<style scoped lang="sass">

</style>