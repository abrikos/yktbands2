<script setup lang="ts">
const props = defineProps<{ link: string, title?:string }>()


const youtubeId = computed(()=>{
    const match = props.link.match(/youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/)
    return match && match[1]
})
</script>

<template lang="pug">
    iframe( width="100%" :src="`https://www.youtube.com/embed/${youtubeId}`"
        :title="title" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen)
</template>

<style scoped lang="sass">

</style>