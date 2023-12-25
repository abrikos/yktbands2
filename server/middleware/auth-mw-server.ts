import {IToken, Token} from "~/server/models/token.model";
export default defineEventHandler(async (event) => {
    const {authExpiration, authTokenName, authRefreshBeforeExpiration} = useRuntimeConfig()
    const cookies = parseCookies(event)
    // @ts-ignore
    await Token.deleteExpiredTokens()
    const token: IToken | null = await Token.findOne({access: cookies[authTokenName]}).populate('user');
    if (token) {
        if(token.expired){
            //console.log('Token refresh', authExpiration , token?.secondsFromCreation)
            await utils.setAuthToken(event, token.user)
        }
        event.context.user = utils.adaptUser(token.user)
    }
})