import {Types} from "mongoose"

const router = createRouter()
const {imgbbKey} = useRuntimeConfig()

router.get('/all', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    return Band.find({$or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]}).populate(Band.getPopulation())
}))

router.put('/create', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    return Band.create({user})
}))

router.get('/:_id/view', defineEventHandler(async (event) => {
    const user = event.context.user
    const {_id} = event.context.params as Record<string, string>
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    return Band
        .findOne({_id, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]})
        .populate(Band.getPopulation())
        .catch(e => {
        })

}))

//User.find().then(console.log)
//Band.find({user:'6575fa559320e6117254d593'}).then(console.log)
//Band.findById('65880f6a385b78755ae5095b')    .populate(Band.getPopulation())    .then(console.log)
//Concert.find({band:'65880f6a385b78755ae5095b'}).then(console.log)
//Concert.find({_id:'658830d7a4bcaf8aa19d9d31'}).then(console.log)
//Concert.deleteMany().then(console.log);
//Place.deleteMany().then(console.log);
//Place.find().then(console.log);
//Concert.find().then(console.log);

router.post('/update', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    const band = await readBody(event)
    const {_id, id, ...data} = band
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    await Band.updateOne({_id, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]}, data)
}))

export default useBase('/api/my-band', router.handler)
