import {Types} from "mongoose";
import {IBand} from "~/server/models/band.model";

const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    return  Artist.find().sort('name')
}))
router.get('/admin-all', defineEventHandler(async (event) => {
    return  Artist.find().sort('name')
}))

router.delete('/:_id', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user || !user.isAdmin) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {_id} = event.context.params as Record<string, string>
    await Instrument.deleteMany({artist:_id})
    await Artist.findByIdAndDelete(_id)
}))

//Artist.deleteMany({name:null}).then(console.log)

router.put('/create', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const {name} = await readBody(event)
    const artist = await Artist.findOne({name})
    if(artist) {
        return artist
    }
    return Artist.create({name, user})

}))

export default useBase('/api/artist', router.handler)
