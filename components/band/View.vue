<script setup lang="ts">
import type {IBand} from "~/server/models/band.model";
import YoutubePlayer from "~/components/band/YoutubePlayer.vue";
import {useAuthStore} from "~/store/auth-store";
import type {IUser} from "~/server/models/user.model";

const {loggedUser} = useAuthStore() as { loggedUser: IUser }
const {band, preview} = defineProps<{ band: IBand, preview:boolean }>()
const router = useRouter()

const canEdit = computed(()=>{
    return loggedUser
            && band
            && (band.shares.map(u=>u.id).includes(loggedUser.id) || band.user.id === loggedUser.id)
})

</script>

<template lang="pug">
div(vif="band")
    h1.text-red(v-if="preview && !band.enabled") Не отображается для всех
    div#header
        NuxtLink#edit-link(v-if="canEdit && !preview" :to="band.editLink") Редактировать
        //div.poster(:style="`background-image:url(${band.posterRnd})`")
        div#poster
            img(:src="band.posterRnd")
        div#info-wrap
            div#info(:style="`background-color: ${band.colorBanner}`")
                img.logo(:src="band.logoRnd" onerror="this.src='/logo.svg'" :style="`background-color: ${band.colorBanner}`")
                h1#band-name(:style="`color: ${band.colorText}`") {{band.name}}
    v-banner#about {{band.about}}
    br
    v-row
        v-col(md="6")
            v-card
                v-toolbar(density="compact" )
                    v-toolbar-title Концерты
                v-card-text
                    v-row(v-for="concert of band.concerts.filter(c=>c.enabled)" :key="concert.id"
                        :class="!concert.id?'new-concert':''")
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
.v-theme--dark
    #info
        background-color: white
#header
    text-align: center
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
            position: absolute
            height: 70px
            top: -70px
            #band-name
                width: 100%
                //border: 1px solid red
                display: flex
                align-items: center
                justify-content: center
    #poster
        height: 400px
        img
            margin: auto
            max-width: 100%
            max-height: 400px
    .logo
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

    .poster
        width: 100%
        height: 400px
        //border: 1px solid red
        background-size: contain
        background-position: top
</style>