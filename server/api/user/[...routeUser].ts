import {Token, IToken} from "~/server/models/token.model";
import {User, IUser} from "~/server/models/user.model";

const router = createRouter()
router.get('/checkAuth', defineEventHandler(async (event) => {
    const cookies = parseCookies(event)
    const token: IToken | null = await Token.findOne({access_token: cookies.auth}).populate('user', ['email', 'name', 'photo']);
    if (!token) {
        return setResponseStatus(event, 401)
    }
    return token.user;

}))
router.get('/logout', defineEventHandler(async (event) => {
    const cookies = parseCookies(event)
    await Token.deleteOne({access_token: cookies.auth});
    deleteCookie(event, 'auth')
    setResponseStatus(event, 200)

}))
router.put('/signup', defineEventHandler(async (event) => {
    const {email, password} = await readBody(event)
    const user: IUser | null = await User.create({email, password}) as unknown as IUser;
    const token: IToken = await Token.create({user}) as unknown as IToken
    setCookie(event, 'auth', token.access_token)
    const found: IUser | null = await User.findById(user.id,'-passwordHash') as unknown as IUser;
    //const {passwordHash, ...rest} = found._doc
    return found

}))
router.post('/login', defineEventHandler(async (event) => {
    const {email, password} = await readBody(event)
    const user: IUser | null = await User.findOne({email});
    if (user?.checkPasswd(password)) {
        const token: IToken = await Token.create({user}) as unknown as IToken
        setCookie(event, 'auth', token.access_token)
        const {passwordHash, ...rest} = user._doc
        return rest
    } else {
        throw createError({
            statusCode: 401,
            message: 'Ошибка аутентификации',
        })
        //setResponseStatus(event, 401)
    }

}))
export default useBase('/api/user', router.handler)
