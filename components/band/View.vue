<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import YoutubePlayer from "~/components/band/YoutubePlayer.vue";
import {useAuthStore} from "~/store/auth-store";
import type {IUser} from "~/server/models/user.model";
import type {IConcert} from "~/server/models/concert.model";

const {loggedUser} = useAuthStore() as { loggedUser: IUser }
const {band, preview} = defineProps<{ band: IBand, preview?: boolean }>()
const router = useRouter()

const canEdit = computed(() => {
    return loggedUser
            && band
            && (band.shares.map(u => u.id).includes(loggedUser.id) || band.user.id === loggedUser.id)
})

const instruments = computed(() => band.instruments
        .sort((a: IInstrument, b: IInstrument) => a.artist.name.toLowerCase() > b.artist.name.toLowerCase() ? 1
                : a.artist.name.toLowerCase() < b.artist.name.toLowerCase() ? -1 : 0))

function expired(concert: IConcert) {
    return new Date(concert.date) < new Date()
}

const showAllConcerts = ref()

</script>

<template lang="pug">
div(vif="band")
    h1.text-red(v-if="preview && !band.enabled") Не отображается для всех
    div#header
        div#poster(:xstyle="`background-image:url('${band.poster}')`")
            v-img(:src="band.poster" onerror="this.src='/ykt-bands-logo.svg'")
        div#info-wrap
            div#info(:style="`background-color: ${band.colorBanner}`")
                img.logo(:src="band.logo" onerror="this.src='/ykt-bands-logo.svg'" :style="`background-color: ${band.colorBanner}`")
                h1#band-name(:style="`color: ${band.colorText}`") {{band.name}}
    v-banner#about {{band.about}}
    NuxtLink#edit-link(v-if="canEdit && !preview" :to="band.editLink") Редактировать
    br
    v-row
        v-col(md="6")
            v-card
                v-toolbar(density="compact" )
                    v-toolbar-title Концерты
                    v-spacer
                    v-btn(@click="showAllConcerts=!showAllConcerts")
                        span(v-if="showAllConcerts") Скрыть прошедшие
                        span(v-else) Показать все

                v-card-text
                    v-row(v-for="concert of band.concerts.filter(c=>c.enabled && (showAllConcerts || !expired(c)))" :key="concert.id"
                        :class="expired(concert)?'new-concert':''")
                        v-col {{concert.place.fullName}}
                        v-col {{concert.dateHuman}}
            br
            BandMessagesView(:band="band")
        v-col
            v-card
                v-toolbar(density="compact" )
                    v-toolbar-title Состав группы
                v-card-text
                    table.instruments
                        tbody
                            tr(v-for="instrument of instruments" :key="instrument.id" align="center" no-gutters)
                                td.text-left {{instrument.artist.name}}
                                td.text-left
                                    BandInstrumentIcon(v-for="icon of instrument.icons" :icon="icon" :key="icon")
            br
            BandPhotoView(:photos="band.photos" :key="Math.random()")
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
    border: 1px dotted red

.instruments
    width: 100%
    border-collapse: collapse

    tr
        //border-bottom: 1px solid silver
        td
            border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity))
            padding: 5px 0

.v-theme--dark
    #info
        background-color: white

#header
    text-align: center
    background-size: contain
    background-repeat: repeat
    background-image: url("/poster-bg2.jpg")
    //border: 1px solid red
    #edit-link
        position: absolute
        background-color: white
        padding: 5px
        border-radius: 6px
        color: black

    #info-wrap
        position: relative

        #info
            width: 100%
            border-top-left-radius: 21px
            border-top-right-radius: 21px
            display: flex
            //position: absolute
            height: 70px
            top: -70px

            #band-name
                width: 100%
                display: flex
                align-items: center
    //justify-content: center
    #poster
        @media only screen and (min-width: 944px)
            height: 350px
        overflow: hidden
        background-size: contain
        background-position: center
        background-repeat: repeat
        //background-image: url("/poster-bg.jpg")
        display: flex

        img
            margin: auto
    //width: 100%
    //max-height: 400px
    .logo
        @media only screen and (max-width: 944px)
            width: 100px
            height: 100px
            top: -48px
        @media only screen and (min-width: 944px)
            width: 150px
            height: 150px
            top: -98px
        position: relative
        margin: 20px
        padding: 5px
        border-radius: 75px
//-webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2)
//-moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2)
//box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2)

</style>