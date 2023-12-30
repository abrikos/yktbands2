<script setup lang="ts">
const tab = ref()
</script>

<template lang="pug">
v-card
    v-toolbar
        v-toolbar-title  Кабинет

    v-tabs(v-model="tab")
        v-tab(:value="1" ) Профиль
        v-tab(:value="2" ) Смена пароля
    UserProfile(v-if="tab===1")
    UserPassword(v-if="tab===2")

</template>
