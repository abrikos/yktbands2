import {H3Event} from "h3";
import {IBand,IInstrument} from "~/server/models/band.model";
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
        const band = await Band
            .findOne({_id, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]})
            // @ts-ignore
            .populate(Band.getPopulation())
        return band
    } catch (e: any) {
        throw createError({statusCode: 403, message: e.message})
    }
}))


router.post('/:_id/share', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    let {cancel} = await readBody(event)
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    // @ts-ignore
    const band = await Band.findOne({_id, user}) as unknown as IBand
    if (!band) throw createError({statusCode: 406, message: 'Давать доступ может только владелец группы'})
    const shareCode = cancel ? '' : Math.random().toString()
    await Band.updateOne({_id, user}, {shareCode})
    return 1
}))

router.post('/:_id/instruments', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    // @ts-ignore
    const band = await Band.findOne({_id, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]}).populate(Band.getPopulation()) as unknown as IBand
    if (!band) throw createError({statusCode: 404, message: 'Группа не найдена'})
    let body = await readBody(event)
    const instruments = []
    for(const instrument of body){
        instruments.push(instrument)
    }
    band.instruments = instruments
    await band.save()
}))

router.post('/update', defineEventHandler(async (event) => {
    //{_id, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]}
    const body = await readBody(event)
    const {_id, id, ...data} = body
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    //data.shortcut = data.shortcut.replace(/\s+/g,'_')
    // @ts-ignore
    await Band.updateOne({_id, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]}, data)
}))

export default useBase('/api/my-band', router.handler)
