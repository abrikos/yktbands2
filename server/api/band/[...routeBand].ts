import {IInstrument} from "~/server/models/instrument.model";

const router = createRouter()
import {Instrument, Band, Artist, Place, Concert} from "#imports";
//Create mongo collection
Artist.find()
Place.find()
Concert.find()
Instrument.find()

router.get('/my-list', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) {
        throw createError({
            statusCode: 403,
            message: 'Доступ запрещён',
        })
    }
    // @ts-ignore
    return Band.find({user}).populate(Band.getPopulation())
}))
router.put('/create', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) {
        throw createError({
            statusCode: 403,
            message: 'Доступ запрещён',
        })
    }
    // @ts-ignore
    return Band.create({user})
}))
router.get('/my-view/:_id', defineEventHandler(async (event) => {
    const user = event.context.user
    const {_id} = event.context.params as Record<string, string>
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    // @ts-ignore
    const res = await Band.findOne({_id, user}).populate(Band.getPopulation())
    return res
}))
router.delete('/instrument/:_id', defineEventHandler(async (event) => {
    const user = event.context.user
    const {_id} = event.context.params as Record<string, string>
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    // @ts-ignore
    const instrument = await Instrument.findById(_id).populate('band') as unknown as IInstrument
    if (!instrument) throw createError({statusCode: 404, message: 'Инструмент не найден'})
    if (!user.equals(instrument.band.user)) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const res = await Instrument.deleteOne({_id})
    console.log('DEELLL', res, _id)
    setResponseStatus(event, 200)
}))
router.put('/:_id/instrument', defineEventHandler(async (event) => {
    const user = event.context.user
    const {_id} = event.context.params as Record<string, string>
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    // @ts-ignore
    const band = await Band.findOne({_id, user}).populate(Band.getPopulation())
    if (!band) throw createError({statusCode: 404, message: 'Группа не найдена'})
    let {artist} = await readBody(event)
    if (!artist) throw createError({statusCode: 406, message: 'Артист не указан'})

    if (typeof artist === 'object') {
        artist = await Artist.findById(artist.id)
    } else {
        artist = await Artist.create({name: artist})
    }
    await Instrument.create({artist, band})
    setResponseStatus(event, 200)
}))
router.post('/my-update', defineEventHandler(async (event) => {
    const {_id, ...data} = await readBody(event)
    const user = event.context.user
    if (!user) {
        throw createError({
            statusCode: 403,
            message: 'Доступ запрещён',
        })
    }
    // @ts-ignore
    await Band.updateOne({_id, user}, data).populate(Band.getPopulation())
    setResponseStatus(event, 200)
}))
router.get('/all', defineEventHandler(async (event) => {
    // @ts-ignore
    return Band.find().populate(Band.getPopulation())
}))

export default useBase('/api/band', router.handler)
