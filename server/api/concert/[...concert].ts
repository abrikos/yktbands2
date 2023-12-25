import {Types} from "mongoose";
import {IConcert} from "~/server/models/concert.model";

const router = createRouter()
const {yandexMapKey} = useRuntimeConfig()
router.get('/all', defineEventHandler(async (event) => {
    return Concert.find({date: {$gt: new Date()}}).sort({date: -1}).populate(Concert.getPopulation())
}))

router.post('/address', defineEventHandler(async (event) => {
    const coordinate = await readBody(event)
    const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${yandexMapKey}&geocode=${coordinate[1]},${coordinate[0]}`
    try {
        const response = await fetch(url)
        const data = await response.json()
        return data?.response?.GeoObjectCollection.featureMember[0]?.GeoObject?.name
    } catch (e: any) {
        throw createError({statusCode: 400, message: 'Ошибка получения адреса:' + e.message})
    }
}))

router.delete('/:_id', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 404, message: 'Ошибка ID'})
    const concert = await Concert.findById(_id)
    if (!concert) throw createError({statusCode: 404, message: 'Концерт не найден'})
    const band = await Band.findOne({_id: concert.band, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]})
    if (!band) throw createError({statusCode: 403, message: 'Группа не найдена'})
    await Concert.deleteOne({_id})
    //await Concert.updateMany({test:Math.random().toString()})
}))
export default useBase('/api/concert', router.handler)
