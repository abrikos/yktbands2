const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    // @ts-ignore
    return  Artist.find().populate(Artist.getPopulation())
}))

export default useBase('/api/artist', router.handler)
