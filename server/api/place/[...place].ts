import {Types} from "mongoose";

const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    // @ts-ignore
    return   Place.find().populate(Place.getPopulation())
    //return   Place.find({coordinateX:{$gt:0},coordinateY:{$gt:0},}).populate(Place.getPopulation())
}))

router.get('/:_id/view', defineEventHandler(async (event) => {
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    // @ts-ignore
    return   Place.findById(_id).populate(Place.getPopulation())
    //return   Place.find({coordinateX:{$gt:0},coordinateY:{$gt:0},}).populate(Place.getPopulation())
}))

//Place.deleteMany().then(console.log)
//Place.find().then(res=>{    console.log(res.length)})

export default useBase('/api/place', router.handler)