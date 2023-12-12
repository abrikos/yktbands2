import {Types} from "mongoose";

const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    // @ts-ignore
    return Concert.find().populate(Concert.getPopulation())
}))

router.post('/address', defineEventHandler(async (event) => {
    const coordinate = await readBody(event)
    const keyYandex = process.env.YMAP
    const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${keyYandex}&geocode=${coordinate[1]},${coordinate[0]}`
    const response = await fetch(url)
    const data = await response.json()
    return data?.response?.GeoObjectCollection.featureMember[0]?.GeoObject?.name
}))

//Place.find().then(console.log)

router.put('/create', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {
        bandId,
        place,
        begin
    } = await readBody(event)
    const {name, address, coordinate} = place
    if (!bandId) throw createError({statusCode: 406, message: 'Ошибка группы'})
    if (!Types.ObjectId.isValid(bandId)) throw createError({statusCode: 406, message: 'Ошибка группы'})
    const band = await Band.findOne({_id: bandId, user})//.populate(Band.getPopulation()) as unknown as IBand
    if (!band) throw createError({statusCode: 403, message: 'Группа не найдена'})
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
    return Concert.create({place: found, begin, band})
}))

export default useBase('/api/concert', router.handler)
