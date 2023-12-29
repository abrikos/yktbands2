import {Token} from "~/server/models/token.model";
//User.find().then(console.log)
export default defineEventHandler(async (event) => {
    const {authExpiration, authTokenName, authRefreshBeforeExpiration} = useRuntimeConfig()
    const cookies = parseCookies(event)
    await Token.deleteExpiredTokens()
    const token  = await Token.findOne({access: cookies[authTokenName]}).populate('user');
    if (token?.user) {
        const {user} = token
        if(token.expired){
            //console.log('Token refresh', authExpiration , token?.secondsFromCreation)
            await utils.setAuthToken(event, user)
        }
        if(!user.isAdmin){
            user.isAdmin = user.email === 'abrikoz@gmail.com' || (user.strategyId === '14278211' && user.strategy === 'telegram')
        }
        event.context.user = utils.adaptUser(user)
    }
})