const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    // @ts-ignore
    return Band.find().populate(Band.getPopulation())
}))

export default useBase('/api/band', router.handler)
