import {Types} from "mongoose";

const router = createRouter()

router.get('/admin-all', defineEventHandler(async (event) => {
    return  Message.find().sort('date')
}))


router.delete('/:_id', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 404, message: 'Ошибка ID'})
    const message = await Message.findById(_id)
    if (!message) throw createError({statusCode: 404, message: 'Сообщение не найдено'})
    const band = await Band.findOne({_id: message.band, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]})
    if (!user.isAdmin && !band) throw createError({statusCode: 403, message: 'Группа не найдена'})
    await Message.deleteOne({_id})
    //await Concert.updateMany({test:Math.random().toString()})
}))
export default useBase('/api/message', router.handler)
