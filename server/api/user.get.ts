import {Token} from "~/server/models/token.model";

export default defineEventHandler(async (event) => {
    try {
        const cookies = parseCookies(event)
        const token = await Token.findOne({access_token: cookies.auth}).populate('user');
        //TODO store user
        return token.user;

    }catch (e) {
        console.log(e.message)
        setResponseStatus(event, 500)
    }
});
