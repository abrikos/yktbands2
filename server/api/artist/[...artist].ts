import {Types} from "mongoose";
import {IBand} from "~/server/models/band.model";

const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    return  Artist.find()
}))

router.put('/create', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён'})
    const body = await readBody(event)
    const {name} = await readBody(event)
    const artist = await Artist.findOne({name})
    if(artist) {
        return artist
    }
    return Artist.create({name})

}))

export default useBase('/api/artist', router.handler)
