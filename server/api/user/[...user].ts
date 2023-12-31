import {Token} from "~/server/models/token.model";
import {User, validateEmail} from "~/server/models/user.model";
import crypto from "crypto";

//User.deleteMany().then(console.log)
const router = createRouter()

router.post('/request-restore-password', defineEventHandler(async (event) => {
    const {email} = await readBody(event)
    const user = await User.findOne({email});
    if (!user) {
        await utils.sleep(4000)
        return 1
    }
    user.restorePassword = crypto.createHmac('sha256', '').update(Math.random().toString()).digest('hex')
    await user.save()
    const res = await utils.sendMail({
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
    const res = await utils.sendMail({
        to: user.email,
        subject: 'Новый пароль',
        text: `Используйте этот пароль: ${password}`
    })
    return 1
}))

router.get('/checkAuth', defineEventHandler(async (event) => {
    return event.context.user
}))

router.get('/admin-all', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user || !user.isAdmin) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    return User.find()
}))

router.delete('/:_id', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user || !user.isAdmin) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    const deletedData = await Band.find({user: _id})
    for (const band of deletedData) {
        Instrument.deleteMany({band: band._id})
        Concert.deleteMany({band: band._id})
        Photo.deleteMany({band: band._id})
        Message.deleteMany({band: band._id})
    }
    await Band.deleteMany({user: _id})
    await User.findByIdAndDelete(_id)
}))


router.get('/logout', defineEventHandler(async (event) => {
    const cookies = parseCookies(event)
    const {authTokenName} = useRuntimeConfig(event)
    await Token.deleteOne({access: cookies[authTokenName]});
    deleteCookie(event, authTokenName)
}))


router.put('/signup', defineEventHandler(async (event) => {
    const {email, password} = await readBody(event)
    const user = await User.create({email, password});
    if (!user) throw createError({statusCode: 403, message: 'STRANGE: create error: '})
    const found = await User.findById(user.id, '-passwordHash')
    if (!found) throw createError({statusCode: 403, message: 'STRANGE: user not found: '})
    await utils.setAuthToken(event, found)
    return utils.adaptUser(found)

}))

router.post('/login/:strategy', defineEventHandler(async (event) => {
    const {strategy} = event.context.params as Record<string, string>
    if (!strategies[strategy]) throw createError({statusCode: 406, message: `Ошибка в стратегии "${strategy}"`})
    const user = await strategies[strategy](event);
    if (!user) throw createError({statusCode: 401, message: 'login: Ошибка аутентификации',})
    await utils.setAuthToken(event, user)
    return utils.adaptUser(user)
}))
router.get('/:_id/toggle-admin', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user || !user.isAdmin) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    const found = await User.findById(_id);
    if (!found) throw createError({statusCode: 401, message: 'login: Ошибка аутентификации',})
    found.isAdmin = !found.isAdmin
    await found.save()
}))

router.post('/update', defineEventHandler(async (event) => {
    const {name, email, avatarImage} = await readBody(event)
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    const found = await User.findById(user.id)
    if (!found) throw createError({statusCode: 403, message: 'STRANGE: user not found: ' + user.id,})
    if (!validateEmail(email)) throw createError({statusCode: 403, message: 'Не верный email'})
    found.email = email
    found.name = name
    found.avatarImage = avatarImage
    try {
        await found.save()
    } catch (e: any) {
        console.error(e)
        if (e.code === 11000) throw createError({statusCode: 406, message: 'Этот email уже занят'})
    }
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
