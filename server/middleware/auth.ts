import {IToken, Token} from "~/server/models/token.model";
import utils from "~/server/utils/utils";

export default defineEventHandler(async (event) => {
    const cookies = parseCookies(event)
    // @ts-ignore
    await Token.deleteExpired(utils.maxAge)
    const token: IToken | null = await Token.findOne({access_token: cookies.auth}).populate('user');
    if (token) {
        event.context.user = utils.adaptUser(token.user)
    }
})