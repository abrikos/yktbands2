import {IToken, Token} from "~/server/models/token.model";
import {User} from "~/server/models/user.model";
export default defineEventHandler(async (event) => {
    const {authExpiration, authTokenName, authRefreshBeforeExpiration} = useRuntimeConfig(event)
    const cookies = parseCookies(event)
    // @ts-ignore
    await Token.deleteExpiredTokens(authExpiration)
    const token: IToken | null = await Token.findOne({access: cookies[authTokenName]}).populate('user');
    if (token) {
        if(authExpiration - token?.secondsFromCreation < authRefreshBeforeExpiration){
            console.log('Token refresh', authExpiration , token?.secondsFromCreation)
            await utils.setAuthToken(event, token.user)
        }
        event.context.user = utils.adaptUser(token.user)
    }
})