<script setup lang="ts">
const {$GET, $POST, $PUT} = useNuxtApp()
const user = ref({email: '1@1.com', password: '1', password2:''})
const {data, refresh} = await $GET('/users')

async function submit(){
    await $PUT('/signup', user)
    refresh()
}
</script>

<template lang="pug">
v-card
    v-card-text {{data}}
        v-text-field(v-model="user.email" label="Email" )
        v-text-field(v-model="user.password" label="Пароль" type="password" )
        v-text-field(v-model="user.password2" label="Подтверждение пароля" type="password" )
    v-card-actions
        v-btn(@click="submit") Send
</template>

<style scoped>

</style>