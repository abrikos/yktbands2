import {H3Event} from "h3";
import {IBand, IInstrument} from "~/server/models/band.model";
import {Types} from "mongoose"

const router = createRouter()


router.get('/all', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    // @ts-ignore
    return Band.find({$or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]}).populate(Band.getPopulation())
}))

router.put('/create', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    // @ts-ignore
    return Band.create({user})
}))

router.get('/:_id/view', defineEventHandler(async (event) => {
    const user = event.context.user
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    try {
        const band = await Band
            .findOne({_id, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]})
            // @ts-ignore
            .populate(Band.getPopulation())
        return band
    } catch (e: any) {
        throw createError({statusCode: 403, message: e.message})
    }
}))

//Band.findById('65880f6a385b78755ae5095b')    .populate(Band.getPopulation())    .then(console.log)
//Concert.find({band:'65880f6a385b78755ae5095b'}).then(console.log)
//Concert.find({_id:'658830d7a4bcaf8aa19d9d31'}).then(console.log)
//Concert.deleteMany().then(console.log);

router.post('/update', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    const body = await readBody(event)
    const {_id, id, ...data} = body
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    for (const concert of body.concerts) {
        concert.band = body.id
        let {_id, id, place, ...concertData} = concert
        if (!(concert.place.name && concert.date && concert.place.address)) continue
        if (!place) continue
        if (!place.coordinate) continue
        const [x, y] = place.coordinate
        if (typeof x !== 'number' || typeof y !== 'number') continue

        if (!place.id) {
            const {address, name} = place
            place = await Place.findOne({address, name})
            if (!place) {
                place = await Place.create({address, name})
            }
        }
        concertData.place = place.id
        if(_id) {
            const q = await Concert.updateOne({_id}, concertData)
        }else{
            const w = await Concert.create(concertData)
            console.log('zzzzzzzz', w)
        }
    }
    await Band.updateOne({_id, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]}, data)
}))

export default useBase('/api/my-band', router.handler)
