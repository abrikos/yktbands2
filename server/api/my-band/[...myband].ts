import {IInstrument} from "~/server/models/instrument.model";
import {Instrument, Band, Artist, Place, Concert} from "#imports";
import {H3Event} from "h3";
import {IBand} from "~/server/models/band.model";
import {Types} from "mongoose"

const router = createRouter()


//Create mongo collection
Artist.find()
Place.find()
Concert.find()
Instrument.find()

router.get('/my-list', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    // @ts-ignore
    return Band.find({user}).populate(Band.getPopulation())
}))
router.put('/create', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    // @ts-ignore
    return Band.create({user})
}))

router.get('/my-view/:_id', defineEventHandler(async (event) => {
    const user = event.context.user
    const {_id} = event.context.params as Record<string, string>
    console.log(Types.ObjectId.isValid(_id))
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    // @ts-ignore
    return Band.findOne({_id, user}).populate(Band.getPopulation())
}))

const findInstrument = async (event: H3Event) => {
    const user = event.context.user
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    // @ts-ignore
    const instrument = await Instrument.findById(_id).populate('band') as unknown as IInstrument
    if (!instrument) throw createError({statusCode: 404, message: 'Инструмент не найден'})
    if (!user.equals(instrument.band.user)) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    return instrument
}

router.delete('/instrument/:_id', defineEventHandler(async (event) => {
    const instrument = await findInstrument(event)
    const {_id} = instrument
    await Instrument.deleteOne({_id})
}))

router.post('/instrument/:_id/icon', defineEventHandler(async (event) => {
    const instrument = await findInstrument(event)
    let {icons} = await readBody(event)
    instrument.icons = icons
    await instrument.save()
}))

router.put('/:_id/instrument', defineEventHandler(async (event) => {
    const user = event.context.user
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    // @ts-ignore
    const band = await Band.findOne({_id, user}).populate(Band.getPopulation()) as unknown as IBand
    if (!band) throw createError({statusCode: 404, message: 'Группа не найдена'})
    let {artist} = await readBody(event)
    if (!artist) throw createError({statusCode: 406, message: 'Необходимо ввести имя или выбрать артиста'})
    if (typeof artist === 'object') {
        artist = await Artist.findById(artist.id)
        if (!artist) throw createError({statusCode: 406, message: 'Артист не найден'})
    } else {
        if (!artist) throw createError({statusCode: 406, message: 'Имя артиста не указано'})
        artist = await Artist.findOne({name: artist})
        if (!artist) {
            artist = await Artist.create({name: artist})
        }
    }
    if (band.instruments.map(i => i.artist.id).includes(artist.id)) {
        throw createError({statusCode: 406, message: 'Артист уже добавлен'})
    }
    await Instrument.create({artist, band})
}))

router.post('/my-update', defineEventHandler(async (event) => {
    const {_id, ...data} = await readBody(event)
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    // @ts-ignore
    await Band.updateOne({_id, user}, data).populate(Band.getPopulation())
}))

export default useBase('/api/my-band', router.handler)
