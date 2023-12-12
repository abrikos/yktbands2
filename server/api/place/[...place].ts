const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    // @ts-ignore
    return   Place.find().populate(Place.getPopulation())
    //return   Place.find({coordinateX:{$gt:0},coordinateY:{$gt:0},}).populate(Place.getPopulation())
}))

export default useBase('/api/place', router.handler)