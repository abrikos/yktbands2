import {Types} from "mongoose";
import nodemailer from "nodemailer";

const router = createRouter()
const {mailUser} = useRuntimeConfig()

router.get('/all', defineEventHandler(async (event) => {
    return Band.find({enabled: true})//.populate(Band.getPopulation())
}))

router.get('/admin-all', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!(user && user.isAdmin)) throw createError({statusCode: 403, message: 'STRANGE: create error: '})
    return Band.find()
}))

router.delete('/:_id', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user || !user.isAdmin) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    Instrument.deleteMany({band: _id})
    Concert.deleteMany({band: _id})
    Photo.deleteMany({band: _id})
    Message.deleteMany({band: _id})
    await Band.deleteOne({_id})
}))


router.get('/:_id/view', defineEventHandler(async (event) => {
    const {_id} = event.context.params as Record<string, string>
    return Band.findById(_id).populate(Band.getPopulation())
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
    if (shares.includes(user.id)) throw createError({statusCode: 406, message: 'Вы уже имеете доступ к этой группе'})
    shares.push(user)
    await Band.updateOne({_id}, {shareCode: '', shares})
    return 1
}))

router.put('/:_id/message', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    const band = await Band.findOne({_id}).populate(['user', 'shares'])
    if (!band) throw createError({statusCode: 404, message: 'Группа не найдена'})
    const {text} = await readBody(event)
    const message = await Message.create({text, band, user})
    await message.populate({path: 'user', select: {email: 1, nameStored: 1, avatarImage: 1}})
    const emails = [band.user.email, ...band.shares.filter(s=>!s.strategy).map(s => s.email)]
    //TODO send telegram
    await utils.sendMail({
        to: emails,
        subject: `[YKT-BANDS] Новое сообщение для группы "${band.name}"`,
        text: `${message.user.name}: ${message.text} \n ${event.node.req.headers.origin}${band.editLink}?tab=messages`
    })
    return message
}))


export default useBase('/api/band', router.handler)
