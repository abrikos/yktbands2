import {Types} from "mongoose";
import {aW} from "~/.output/public/_nuxt/entry.8e3eb3d9";
import {User} from "~/server/models/user.model";

const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    return Band.find({enabled: true})//.populate(Band.getPopulation())
}))

router.get('/:_id/view', defineEventHandler(async (event) => {
    const {_id} = event.context.params as Record<string, string>
    return  Band.findById(_id).populate(Band.getPopulation())
}))

router.post('/:_id/share', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'STRANGE: create error: '})
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 404, message: 'Ошибка ID'})
    const {shareCode} = await readBody(event)
    const band = await Band.findOne({_id, shareCode})
    if (!band) throw createError({statusCode: 404, message: 'К этой группе нет доступа'})
    const {shares} = band
    if(shares.includes(user.id)) throw createError({statusCode: 406, message: 'Вы уже имеете доступ к этой группе'})
    shares.push(user)
    await Band.updateOne({_id}, {shareCode:'', shares})
    return 1
}))

router.put('/:_id/message', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    const band = await Band.findOne({_id})
    if (!band) throw createError({statusCode: 404, message: 'Группа не найдена'})
    const {text} = await readBody(event)
    const message = await Message.create({text, band, user})
    const found = await Message.findById(message.id)
    /*const res = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: 'Новый пароль',
        text: `Используйте этот пароль: ${password}`
    })*/
    return  message.populate({path: 'user', select: {email: 1, nameStored: 1, avatarImage: 1}})
}))


export default useBase('/api/band', router.handler)
