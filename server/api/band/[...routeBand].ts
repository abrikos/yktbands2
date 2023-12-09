const router = createRouter()
import {Instrument, Band, Artist, Place, Concert} from "#imports";
//Create mongo collection
Artist.find()
Place.find()
Concert.find()
Instrument.find()

router.get('/my-list', defineEventHandler(async (event) => {
    const user =event.context.user
    if(!user){
        throw createError({
            statusCode: 403,
            message: 'Доступ запрещён',
        })
    }
    // @ts-ignore
    return Band.find({user}).populate(Band.getPopulation())
}))
router.put('/create', defineEventHandler(async (event) => {
    const user =event.context.user
    if(!user){
        throw createError({
            statusCode: 403,
            message: 'Доступ запрещён',
        })
    }
    // @ts-ignore
    return Band.create({user})
}))
router.get('/my-view/:_id', defineEventHandler(async (event) => {
    //const {_id} = await readBody(event)
    const user =event.context.user
    const {_id} = event.context.params as Record<string, string>
    if(!user){
        throw createError({
            statusCode: 403,
            message: 'Доступ запрещён',
        })
    }
    // @ts-ignore
    return Band.findOne({_id,user}).populate(Band.getPopulation())
}))
router.post('/my-update', defineEventHandler(async (event) => {
    const {_id,...data} = await readBody(event)
    const user =event.context.user
    if(!user){
        throw createError({
            statusCode: 403,
            message: 'Доступ запрещён',
        })
    }
    // @ts-ignore
    return Band.updateOne({_id,user}, data).populate(Band.getPopulation())
}))
router.post('/all', defineEventHandler(async (event) => {
    // @ts-ignore
    return Band.find().populate(Band.getPopulation())
}))

export default useBase('/api/band', router.handler)
