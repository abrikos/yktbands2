<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import YoutubePlayer from "~/components/band/YoutubePlayer.vue";

const route = useRoute()

interface IBandResponse {
    data: IBand
    refresh: any
    pending: any
}

const {data: band, refresh: refreshBand, pending: pendingBand} = await
        useNuxtApp().$GET(`/band/${route.params.id}/view/`) as unknown as IBandResponse

const {$listen} = useNuxtApp()
$listen('band-view:refresh', () => refreshBand())

</script>

<template lang="pug">
div(v-if="band")
    v-toolbar(color="primary" )
        v-toolbar-title {{band.nameOrShortcut}}
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
                    v-row(v-for="concert of band.concerts.filter(c=>c.enabled)" :key="concert.id")
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
            v-card
                v-toolbar(density="compact" )
                    v-toolbar-title Ролики на youtube
                v-card-text
                    div(v-for="(link,i) of band.youtube" :key="i" )
                        YoutubePlayer(:link="link")

</template>

<style scoped lang="sass">
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