import {Types} from "mongoose";

const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    return Place.find().populate(Place.getPopulation())
}))

router.get('/admin-all', defineEventHandler(async (event) => {
    return Place.find()
}))

router.delete('/:_id', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user || !user.isAdmin) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    await Concert.deleteMany({place:_id})
    await Place.findByIdAndDelete(_id)
}))


router.get('/:_id/view', defineEventHandler(async (event) => {
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    return Place.findById(_id).populate(Place.getPopulation())
    //return   Place.find({coordinateX:{$gt:0},coordinateY:{$gt:0},}).populate(Place.getPopulation())
}))

//Place.deleteMany().then(console.log)
//Place.find().then(res=>{    console.log(res.length)})

router.put('/upsert', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    const {address, name, coordinate} = await readBody(event)
    const found = await Place.findOne({address, name})
    if (found) return found
    return Place.create({address, name, coordinate, user})
}))


export default useBase('/api/place', router.handler)