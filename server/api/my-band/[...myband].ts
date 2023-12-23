import {IInstrument} from "~/server/models/instrument.model";
import {H3Event} from "h3";
import {IBand} from "~/server/models/band.model";
import {Types} from "mongoose"

const router = createRouter()


router.get('/all', defineEventHandler(async (event) => {
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

// router.post('/:_id/upload', defineEventHandler(async (event) => {
//     const user = event.context.user
//     if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
//     const {_id} = event.context.params as Record<string, string>
//     if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
//     const band = await Band.findOne({_id, user})
//     if (!band) throw createError({statusCode: 404, message: 'Группа не найдена'})
//     let formData = await readMultipartFormData(event)
//     if (formData) {
//         const file = formData[0].data
//         const type = formData[1].data.toString()
//         const [width, height] = type==='logo' ? [100, 100] : [400,400]
//         fs.writeFile(`./public/upload/${type}_${band.id}.png`, file, res => console.log(res))
//     }
//     //if (!file) throw createError({statusCode: 406, message: 'Необходимо отправить файл'})
// }))

router.get('/:_id/view', defineEventHandler(async (event) => {
    const user = event.context.user
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    try {
        // @ts-ignore
        return Band.findOne({_id, $or: [{user}, {share: {$in: user}}]}).populate(Band.getPopulation())
    }catch (e: any) {
        throw createError({statusCode: 403, message: e.message})
    }
}))

const findInstrument = async (event: H3Event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})

    // @ts-ignore
    const instrument = await Instrument.findById(_id).populate('band') as unknown as IInstrument
    if (!instrument) throw createError({statusCode: 404, message: 'Инструмент не найден'})
    if (!user.equals(instrument.band.user)) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    return instrument
}

//Band.updateMany({},{youtube:['zzz']}).then(console.log)
//Band.find({}).select('youtube logo').then(console.log)

router.delete('/instrument/:_id', defineEventHandler(async (event) => {
    const instrument = await findInstrument(event)
    const {_id} = instrument
    await Instrument.deleteOne({_id})
}))

router.post('/instrument/:_id/icon', defineEventHandler(async (event) => {
    const instrument = await findInstrument(event)
    instrument.icons = await readBody(event)
    await instrument.save()
}))
router.post('/:_id/share', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    // @ts-ignore
    const band = Band.findOne({_id, user}).populate(Band.getPopulation()) as unknown as IBand
    if(!band) throw createError({statusCode: 406, message: 'Группа не найдена'})
    const shareCode = Math.random().toString()
    await Band.updateOne({_id, user}, {shareCode})
}))

router.put('/:_id/instrument', defineEventHandler(async (event) => {
    const user = event.context.user
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    // @ts-ignore
    const band = await Band.findOne({_id, user}).populate(Band.getPopulation()) as unknown as IBand
    if (!band) throw createError({statusCode: 404, message: 'Группа не найдена'})
    let body = await readBody(event)
    if (!body.artist) throw createError({statusCode: 406, message: 'Необходимо ввести имя или выбрать артиста'})
    let artist
    if (typeof body.artist === 'object') {
        artist = await Artist.findById(body.artist.id)
        if (!artist) throw createError({statusCode: 406, message: 'Артист не найден'})
    } else {
        artist = await Artist.findOne({name: body.artist})
        if (!artist) {
            artist = await Artist.create({name: body.artist})
        }

    }
    if (band.instruments.map(i => i.artist.id).includes(artist.id)) {
        throw createError({statusCode: 406, message: 'Артист уже добавлен'})
    }
    await Instrument.create({artist, band})
}))

router.post('/update', defineEventHandler(async (event) => {
    const {_id, id, ...data} = await readBody(event)
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    //data.shortcut = data.shortcut.replace(/\s+/g,'_')
    // @ts-ignore
    await Band.updateOne({_id, user}, data)
}))

export default useBase('/api/my-band', router.handler)
