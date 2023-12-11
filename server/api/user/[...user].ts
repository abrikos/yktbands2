import {Token, IToken} from "~/server/models/token.model";
import {User, IUser} from "~/server/models/user.model";
import {BinaryLike} from "node:crypto";
import crypto from "crypto";
import nodemailer from 'nodemailer'
import {password} from "iron-webcrypto";
import {strategies} from "~/server/utils/strategies";

//User.deleteMany().then(console.log)
const router = createRouter()
const maxAge = utils.maxAge

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});


router.post('/request-restore-password', defineEventHandler(async (event) => {
    const {email} = await readBody(event)
    const user: IUser | null = await User.findOne({email}) as unknown as IUser;
    if (!user) {
        await utils.sleep(4000)
        return 1
    }
    user.restorePassword = crypto.createHmac('sha256', '').update(Math.random().toString()).digest('hex')
    await user.save()
    const res = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Восстановление пароля',
        text: `Ссылка восстановления ${event.node.req.headers.origin}/password-restore-${user.restorePassword}`
    })
    if (!res.messageId) throw createError({statusCode: 500, message: 'Ошибка отправки'})
    return 1
}))

router.post('/process-restore-password', defineEventHandler(async (event) => {
    const {code} = await readBody(event)
    const user: IUser | null = await User.findOne({restorePassword: code}) as unknown as IUser;
    if (!user) return
    const password = crypto.createHmac('sha256', '').update(Math.random().toString()).digest('hex').substring(1, 5)
    user.password = password
    user.restorePassword = ''
    await user.save()
    const res = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: 'Новый пароль',
        text: `Используйте этот пароль: ${password}`
    })
    return 1
}))

router.get('/checkAuth', defineEventHandler(async (event) => {
    return event.context.user
}))

router.get('/logout', defineEventHandler(async (event) => {
    const cookies = parseCookies(event)
    await Token.deleteOne({access_token: cookies.auth});
    deleteCookie(event, 'auth')
}))

router.put('/signup', defineEventHandler(async (event) => {
    const {email, password} = await readBody(event)
    const user: IUser | null = await User.create({email, password}) as unknown as IUser;
    const token: IToken = await Token.create({user}) as unknown as IToken
    setCookie(event, 'auth', token.access_token, {maxAge})
    const found: IUser | null = await User.findById(user.id, '-passwordHash') as unknown as IUser;
    //const {passwordHash, ...rest} = found._doc
    return found

}))

router.post('/login/:strategy', defineEventHandler(async (event) => {
    const {strategy} = event.context.params as Record<string, string>
    if(!strategies[strategy]) throw createError({statusCode: 406, message: `Ошибка в стратегии "${strategy}"`})
    const user = await strategies[strategy](event);
    if (!user) throw createError({statusCode: 401, message: 'login: Ошибка аутентификации',})
    const token: IToken = await Token.create({user}) as unknown as IToken
    setCookie(event, 'auth', token.access_token, {maxAge})
    return utils.adaptUser(user)
}))

router.post('/update', defineEventHandler(async (event) => {
    const {name, password, avatarImage} = await readBody(event)
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    user.name = name
    user.avatarImage = avatarImage
    if (password) user.password = password
    await user.save()
}))

router.post('/password', defineEventHandler(async (event) => {
    const {password} = await readBody(event)
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    if (password) {
        user.password = password
        await user.save()
    }
}))

export default useBase('/api/user', router.handler)
