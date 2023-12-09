import {Token, IToken} from "~/server/models/token.model";
import {User, IUser} from "~/server/models/user.model";

const router = createRouter()
router.get('/checkAuth', defineEventHandler(async (event)=>{
    const cookies = parseCookies(event)
    const token: IToken | null = await Token.findOne({access_token: cookies.auth}).populate('user', ['email', 'name', 'photo']);
    if (!token) {
        return setResponseStatus(event, 401)
    }
    console.log(token.user)
    return token.user;

}))
router.get('/logout', defineEventHandler(async (event)=>{
    const cookies = parseCookies(event)
    await Token.deleteOne({access_token: cookies.auth});
    deleteCookie(event, 'auth')
    setResponseStatus(event, 200)

}))
router.put('/signup', defineEventHandler(async (event)=>{
    const {email, password} = await readBody(event)
    const user = await User.create({email, password});
    const token: IToken = await Token.create({user}) as unknown as IToken
    setCookie(event, 'auth', token.access_token)
    return token.access_token

}))
router.post('/login', defineEventHandler(async (event)=>{
    const {email, password} = await readBody(event)
    const user: IUser | null = await User.findOne({email});
    if (user?.checkPasswd(password)) {
        const token: IToken = await Token.create({user}) as unknown as IToken
        setCookie(event, 'auth', token.access_token)
        return {user,token}
    } else {
        throw createError({
            statusCode: 401,
            statusMessage: 'Ошибка аутентификации',
        })
        //setResponseStatus(event, 401)
    }

}))
export default useBase('/api/user', router.handler)

/*
interface Endpoints {
    [key: string]: () => Promise<any>
}

export default defineEventHandler(async (event) => {
    try {
        const route: string = event.context.params?.routeUser as string || 'SomeEP'

        console.log(route)
        const endpoints: Endpoints = {
            async logout() {
            },
            async signup() {
            },
            async login() {
            },
            async test(){
                console.log(event.context)
              return'dddTTTRRR'
            },
            async checkAuth() {
            }
        }
        return (endpoints as Endpoints)[route]()
    } catch (e) {
        console.log(e)
        throw createError({
            statusCode: 500,
            statusMessage: JSON.stringify(e),
        })
    }
});
*/
