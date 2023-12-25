import {User, Concert, Place, Band, Token, Artist, Message} from "#imports";
export default defineEventHandler(async (event) => {
    User.findOne()
    Concert.findOne()
    Place.findOne()
    Band.findOne()
    Token.findOne()
    Artist.findOne()
    Message.findOne()
})