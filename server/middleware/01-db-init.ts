import {User, Concert, Place, Band, Token, Artist, Message} from "#imports";
import {Instrument} from "~/server/models/instrument.model";
import {Photo} from "~/server/models/photo.model";
export default defineEventHandler(async (event) => {
    User.findOne()
    Concert.findOne()
    Place.findOne()
    Band.findOne()
    Token.findOne()
    Artist.findOne()
    Message.findOne()
    Instrument.findOne()
    Photo.findOne()
})