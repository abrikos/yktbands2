import {Types} from "mongoose";
import {IConcert} from "~/server/models/concert.model";

const router = createRouter()


router.get('/band/:_id', defineEventHandler(async (event) => {
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 404, message: 'Ошибка ID'})
    const band = await Band.findById(_id).populate(Band.getPopulation())
    if (!band) throw createError({statusCode: 404, message: 'Группа не найдена: ' + _id})
    return band.instruments
        .sort((a: IInstrument, b: IInstrument) => a.artist.name.toLowerCase() > b.artist.name.toLowerCase() ? 1
            : a.artist.name.toLowerCase() < b.artist.name.toLowerCase() ? -1 : 0)
}))

//Instrument.deleteMany().then(console.log)

router.put('/upsert', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const instruments = await readBody(event)
    if(!instruments.length) return
    const band = await Band
        .findOne({_id: instruments[0].band, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]})
    if (!band) throw createError({statusCode: 406, message: 'Редактирование группы недоступно'})
    for(const instrument of instruments) {
        console.log(instrument)
        if (instrument.id) {
            await Instrument.findByIdAndUpdate(instrument.id, instrument)
        } else {
            await Instrument.create(instrument)
        }
    }
    //return Concert.findOneAndUpdate({_id: concert.id}, {$setOnInsert: concert}, {upsert: true, new: true})

}))

router.delete('/:_id', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 404, message: 'Ошибка ID'})
    const instrument = await Instrument.findById(_id)
    if (!instrument) throw createError({statusCode: 404, message: 'не найден'})
    const band = await Band.findOne({_id: instrument.band, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]})
    if (!band) throw createError({statusCode: 403, message: 'Группа не найдена'})
    await Instrument.findByIdAndDelete(_id)
    //await Concert.updateMany({test:Math.random().toString()})
}))
export default useBase('/api/instrument', router.handler)
