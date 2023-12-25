import {Token} from "~/server/models/token.model";
import {IUser, User} from "~/server/models/user.model";
import crypto from "crypto";
import nodemailer from 'nodemailer'

//User.deleteMany().then(console.log)
const router = createRouter()

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
    const user = await User.findOne({email});
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
    const user = await User.findOne({restorePassword: code});
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
    const { authTokenName} = useRuntimeConfig(event)
    await Token.deleteOne({access: cookies[authTokenName]});
    deleteCookie(event, authTokenName)
}))


router.put('/signup', defineEventHandler(async (event) => {
    const {email, password} = await readBody(event)
    const user = await User.create({email, password});
    if (!user) throw createError({statusCode: 403, message: 'STRANGE: create error: '})
    const found = await User.findById(user.id, '-passwordHash')
    if (!found) throw createError({statusCode: 403, message: 'STRANGE: user not found: '})
    await  utils.setAuthToken(event, found)
    return utils.adaptUser(found)

}))

router.post('/login/:strategy', defineEventHandler(async (event) => {
    const {strategy} = event.context.params as Record<string, string>
    if(!strategies[strategy]) throw createError({statusCode: 406, message: `Ошибка в стратегии "${strategy}"`})
    const user = await strategies[strategy](event);
    if (!user) throw createError({statusCode: 401, message: 'login: Ошибка аутентификации',})
    await  utils.setAuthToken(event, user)
    return utils.adaptUser(user)
}))

router.post('/update', defineEventHandler(async (event) => {
    const {name, password, avatarImage} = await readBody(event)
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    const found = await User.findById(user.id)
    if (!found) throw createError({statusCode: 403, message: 'STRANGE: user not found: ' + user.id,})
    found.name = name
    found.avatarImage = avatarImage
    await found.save()
}))

//User.updateOne({email:'abrikoz@gmail.com'},{passwordHash:'d09ae2219e185ef2cbc84e1425e6cc08959a831e0646a0d85bd1542505571098'}).then(console.log)

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
