import {Types} from "mongoose";

const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    // @ts-ignore
    return Place.find().populate(Place.getPopulation())
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
    const concert = await readBody(event)
    const place = JSON.parse(JSON.stringify(concert.place))
    if (!concert.band) throw createError({statusCode: 406, message: 'Ошибка группы'})
    if (!concert.place) throw createError({statusCode: 406, message: 'Ошибка ресторана'})
    const found = await Band.findOne({_id: concert.band.id, user})//.populate(Band.getPopulation()) as unknown as IBand
    if (!found) throw createError({statusCode: 403, message: 'Группа не найдена'})
    if (Types.ObjectId.isValid(concert.place.id)) {
        concert.place = await Place.findById(concert.place.id)
    } else {
        const {name, address} = concert.place
        concert.place = await Place.findOne({name, address})
    }
    if (!concert.place) {

        concert.place = await Place.create(place)
        console.log('==========CCCCCCCCCCCRRRRRRRRR', concert.place)
    }
    console.log('zzzzzzzzzzzzzzzzzzzzzzz', concert.place)
    return Concert.create(concert)
}))

export default useBase('/api/concert', router.handler)
