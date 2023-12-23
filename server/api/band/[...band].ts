const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    // @ts-ignore
    return Band.find({enabled: true})//.populate(Band.getPopulation())
}))

router.get('/:_id/view', defineEventHandler(async (event) => {
    const {_id} = event.context.params as Record<string, string>

    // @ts-ignore
    const band = await Band.findById(_id).populate(Band.getPopulation())
        .catch(e => {

        })
    if (band) return band
}))

router.post('/:_id/share', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'STRANGE: create error: '})
    const {_id} = event.context.params as Record<string, string>
    const {shareCode} = await readBody(event)
    const band = await Band.findOne<IBand>({_id, shareCode})
    if (!band) throw createError({statusCode: 404, message: 'К этой группе нет доступа'})
    const {shares} = band
    if(shares.includes(user.id)) throw createError({statusCode: 406, message: 'Вы уже имеете доступ к этой группе'})
    shares.push(user)
    await Band.updateOne({_id}, {shareCode:'', shares})
    return 1
}))

export default useBase('/api/band', router.handler)
