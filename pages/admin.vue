<script setup lang="ts">

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
                AdminModelTable(model="user" :headers="['name','email']")
        v-col
            v-container
                AdminModelTable(model="artist" :headers="['name']")
                AdminModelTable(model="band" :headers="['name']")

</template>

<style scoped lang="sass">

</style>