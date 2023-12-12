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
        placeId,
        coordinate,
        address,
        name,
        begin
    } = await readBody(event)
    if (!bandId) throw createError({statusCode: 406, message: 'Ошибка группы'})
    if (!Types.ObjectId.isValid(bandId)) throw createError({statusCode: 406, message: 'Ошибка группы'})
    const band = await Band.findOne({_id: bandId, user})//.populate(Band.getPopulation()) as unknown as IBand
    if (!band) throw createError({statusCode: 403, message: 'Группа не найдена'})
    let place
    if (placeId && Types.ObjectId.isValid(placeId)) {
        place = await Place.findById(placeId)
    }
    if (!place) {
        place = await Place.findOne({name, address})
    }
    if (!place) {
        //if(coordinate)
        place = await Place.create({name, address, coordinate})
    }
    return Concert.create({place, begin, band, user})
}))

export default useBase('/api/concert', router.handler)
