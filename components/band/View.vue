<script setup lang="ts">
import type {IBand, IBandResponse} from "~/server/models/band.model";
import YoutubePlayer from "~/components/band/YoutubePlayer.vue";

const props = defineProps<{ band: IBand }>()
const route = useRoute()
let {band} = props
if(!band){
    const {data: bandData, refresh: refreshBand, pending: pendingBand} = await
            useNuxtApp().$GET(`/band/${route.params.id}/view/`, true) as unknown as IBandResponse
    band = bandData.value
}

</script>

<template lang="pug">
div(vif="band")
    v-toolbar(color="primary" )
        v-toolbar-title {{band.name}}
    div#images
        img.logo(:src="band.logoRnd" onerror="this.src='/logo.svg'")
        //img.poster(:src="band.posterRnd" onerror="this.src='/logo.svg'")
        div.poster(:style="`background-image:url(${band.posterRnd})`")
    br
    v-row
        v-col
            v-card
                v-toolbar(density="compact" )
                    v-toolbar-title Концерты
                v-card-text
                    v-row(v-for="concert of band.concerts.filter(c=>c.enabled)" :key="concert.id"
                        :class="!concert.id?'new-concert':''")
                        v-col {{concert.place.fullName}}
                        v-col {{concert.dateHuman}}
        v-col
            v-card
                v-toolbar(density="compact" )
                    v-toolbar-title Состав группы
                v-card-text
                    table.instruments
                        tbody
                            tr(v-for="instrument of band.instruments" :key="instrument.id" align="center" no-gutters)
                                td.text-left {{instrument.artist.name}}
                                td.text-left
                                    BandInstrumentIcon(v-for="icon of instrument.icons" :icon="icon" :key="icon")
            br
            BandPhotoView(:photos="band.photos")
            br
            v-card
                v-toolbar(density="compact" )
                    v-toolbar-title Ролики на youtube
                v-card-text
                    div(v-for="(link,i) of band.youtube" :key="i" )
                        YoutubePlayer(:link="link")

</template>

<style scoped lang="sass">
.new-concert
    background-color: red
.instruments
    width: 100%
    border-collapse: collapse

    tr
        //border-bottom: 1px solid silver
        td
            border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity))
            padding: 5px 0

#images
    .logo
        max-width: 100px
        max-height: 100px
        position: absolute
        margin: 20px
        border-radius: 10px
        -webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2)
        -moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2)
        box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2)

    .poster
        width: 100%
        height: 400px
        //border: 1px solid red
        background-size: cover
</style>