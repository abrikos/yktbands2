const router = createRouter()
const maxAge = 3600 * 24

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
router.post('/my-view', defineEventHandler(async (event) => {
    const {_id} = await readBody(event)
    const user =event.context.user
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
