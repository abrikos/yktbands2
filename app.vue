<script lang="ts" setup>
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth-store'; // import the auth store we just created
import { useTheme } from 'vuetify'
const theme = useTheme()

const { getUser } = useAuthStore();
await getUser()

const { logUserOut } = useAuthStore(); // use authenticateUser action from  auth store
const { user } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const drawerLeft = ref(true)
const drawerRight = ref(false)
const nightMode = ref(true)


function toggleTheme () {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

</script>
<template lang="pug">
v-app
    v-app-bar(density="compact" )
        v-app-bar-title Ykt Bands
        v-btn(to="/cabinet" v-if="user") {{user.name}}
            img.avatar22(:src="user.photo"  onerror="this.src='/avatar.png'")
        template(v-slot:prepend)
            v-app-bar-nav-icon(@click.stop="drawerLeft = !drawerLeft")
        template(v-slot:append)
            v-btn(icon="mdi-dots-vertical" @click.stop="drawerRight = !drawerRight")
    v-navigation-drawer(v-model="drawerRight" temporary location="right" )
        v-list
            v-list-item
                v-switch(@click="toggleTheme" v-model="nightMode" label="Ночной режим" )

    v-navigation-drawer(v-model="drawerLeft")
        v-list
            v-list-item(to="/") Начало
            v-list-item(to="/bands") Bands
            v-list-item(to="/login" v-if="!user") Войти
            v-list-item(to="/signup" v-if="!user") Регистрация
            v-list-item(@click="logUserOut" v-if="user") Выйти

    v-main
        v-container
            NuxtPage
    NuxtSnackbar
</template>

<style scoped lang="sass">
.avatar22
    max-height: 30px
    max-width: 30px
</style>