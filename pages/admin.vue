<script setup lang="ts">
import type {IUser} from "~/server/models/user.model";

async function makeAdmin(user: IUser) {
    await useNuxtApp().$GET(`/user/${user.id}/toggle-admin`)
}
</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title Admin
    v-row
        v-col
            v-container
                AdminModelTable(model="message" :headers="['user.name','text', 'date']")
                AdminModelTable(model="place" :headers="['fullName']")
                AdminModelTable(model="user" :headers="['name','isAdmin']" :buttons="[{icon:'mdi-shield-crown', onClick:makeAdmin, tooltip:'Toggle isAdmin'}]")
        v-col
            v-container
                AdminModelTable(model="artist" :headers="['name']")
                AdminModelTable(model="band" :headers="['name']")

</template>

<style scoped lang="sass">

</style>