import {Types} from "mongoose";
import {IConcert} from "~/server/models/concert.model";

const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    // @ts-ignore
    return Concert.find({date: {$gt: new Date()}}).sort({date: -1}).populate(Concert.getPopulation())
}))

router.post('/address', defineEventHandler(async (event) => {
    const coordinate = await readBody(event)
    const keyYandex = process.env.YMAP
    const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${keyYandex}&geocode=${coordinate[1]},${coordinate[0]}`
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
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 404, message: 'Концерт не найден'})
    const concert = await Concert.findById(_id) as unknown as IConcert
    if (!concert) throw createError({statusCode: 404, message: 'Концерт не найден'})
    const band = await Band.findOne({_id: concert.band, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]})//.populate(Band.getPopulation()) as unknown as IBand
    if (!band) throw createError({statusCode: 403, message: 'Группа не найдена'})
    await Concert.deleteOne({_id})
    //await Concert.updateMany({test:Math.random().toString()})
}))

//Concert.find().then(console.log)
//Concert.deleteMany().then(console.log)

router.put('/upsert', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const body = await readBody(event)
    const {
        id,
        enabled,
        band,
        place,
        date,
        hour
    } = body
    const {name, address, coordinate} = place
    if (!band) throw createError({statusCode: 406, message: 'Ошибка группы: no band'})
    if (!Types.ObjectId.isValid(band.id || band)) throw createError({
        statusCode: 406,
        message: `Ошибка группы: wrong id:"${band}"`
    })
    const bandFound = await Band.findOne({_id: band.id || band, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]})//.populate(Band.getPopulation()) as unknown as IBand
    if (!bandFound) throw createError({statusCode: 403, message: 'Группа не найдена'})
    let found
    if (place.id && Types.ObjectId.isValid(place.id)) {
        found = await Place.findById(place.id)
    }
    if (!found) {
        found = await Place.findOne({name, address})
    }
    if (!found) {
        found = await Place.create({name, address, coordinate})
    }
    if (id) {
        await Concert.updateOne({_id: id}, {place: found, date, hour, band, enabled})
    } else {
        await Concert.create({place: found, date, hour, band, enabled})
    }

}))

export default useBase('/api/concert', router.handler)
