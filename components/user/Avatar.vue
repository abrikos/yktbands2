<script setup lang="ts">
const props = defineProps({
    user: {type: Object, required: true}
})

</script>

<template lang="pug">
img.avatar(:src="user.photo" onerror="this.src='/avatar.png'")
</template>

<style scoped lang="sass">
.avatar
    width: 30px
    border-radius: 15px
    border: 1px solid gray
    margin: 2px
</style>