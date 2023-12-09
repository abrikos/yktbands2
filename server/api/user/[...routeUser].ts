import {Token, IToken} from "~/server/models/token.model";
import {User, IUser} from "~/server/models/user.model";
import {BinaryLike} from "node:crypto";
import crypto from "crypto";
import {H3Event} from "h3";

//User.deleteMany().then(console.log)
const router = createRouter()
const maxAge = 3600 * 24


router.get('/checkAuth', defineEventHandler(async (event) => {
    return event.context.user
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
    setCookie(event, 'auth', token.access_token,{maxAge})
    const found: IUser | null = await User.findById(user.id,'-passwordHash') as unknown as IUser;
    //const {passwordHash, ...rest} = found._doc
    return found

}))
router.post('/login', defineEventHandler(async (event) => {
    const {email, password} = await readBody(event)
    const user: IUser | null = await User.findOne({email});
    if (user?.checkPasswd(password)) {
        const token: IToken = await Token.create({user}) as unknown as IToken
        setCookie(event, 'auth', token.access_token, {maxAge})
        return utils.adaptUser(user)
    } else {
        throw createError({
            statusCode: 401,
            message: '/login: Ошибка аутентификации',
        })

    }
}))
router.post('/update', defineEventHandler(async (event) => {
    const {name, password, photo} = await readBody(event)
    const user = event.context.user
    if(!user){
        throw createError({
            statusCode: 403,
            message: 'Доступ запрещён',
        })
    }
    user.name = name
    user.photo = photo
    if(password) user.password = password
    await user.save()
    setResponseStatus(event, 200)
}))
router.post('/password', defineEventHandler(async (event) => {
    const {password} = await readBody(event)
    const user = event.context.user
    if(!user){
        throw createError({
            statusCode: 403,
            message: 'Доступ запрещён',
        })
    }
    if(password) {
        user.password = password
        await user.save()
    }
    setResponseStatus(event, 200)
}))
router.post('/telegram', defineEventHandler(async (event) => {
    const body = await readBody(event)
    function checkSignature(body: any) {
        const {hash, ...data} = body
        const TOKEN: BinaryLike = process.env.BOT_TOKEN as BinaryLike;
        const secret = crypto.createHash('sha256')
            .update(TOKEN)
            .digest();
        const {returnUrl, strategy, ...rest} = data;
        const checkString = Object.keys(rest)
            .sort()
            .map(k => (`${k}=${data[k]}`))
            .join('\n');
        const hmac = crypto.createHmac('sha256', secret)
            .update(checkString)
            .digest('hex');
        return hmac === hash
    }

    const {username, first_name, last_name, photo_url} = body

    if (checkSignature(body)) {
        const email =username + '@telegram.org'
        let user:IUser = await User.findOne({email, strategy: 'telegram'}) as unknown as IUser;
        if (!user) {
            user = await User.create({
                strategy: 'telegram',
                name: first_name + ' ' + last_name,
                photo: photo_url,
                email,
            }) as unknown as IUser;
        }
        const token: IToken = await Token.create({user}) as unknown as IToken
        setCookie(event, 'auth', token.access_token,{maxAge})
        return utils.adaptUser(user)
    } else {
        throw createError({
            statusCode: 401,
            message: 'Ошибка аутентификации',
        })
    }

}))
export default useBase('/api/user', router.handler)
