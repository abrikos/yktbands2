<script lang="ts" setup>
const {$GET, $POST, $PUT} = useNuxtApp()
const {data: users, refresh} = await $GET('/user')

const drawerLeft = ref(false)
const drawerRight = ref(false)


</script>
<template lang="pug">
v-app
    v-app-bar(density="compact" )
        v-app-bar-title Ykt Bands {{users}}
        template(v-slot:prepend)
            v-app-bar-nav-icon(@click.stop="drawerLeft = !drawerLeft")
        template(v-slot:append)
            v-btn(icon="mdi-dots-vertical" @click.stop="drawerRight = !drawerRight")
    v-navigation-drawer(v-model="drawerRight" temporary location="right" )
        v-list
            v-list-item Lang
            v-list-item Theme
    v-navigation-drawer(v-model="drawerLeft")
        v-list
            v-list-item(to="/") Начало
            v-list-item(to="/bands") Bands
            v-list-item(to="/login") Войти
            v-list-item(to="/signup") Регистрация
    v-main
        v-container
            NuxtPage
    NuxtSnackbar
</template>
