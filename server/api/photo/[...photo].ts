import {Types} from "mongoose"

const router = createRouter()
const {imgbbKey} = useRuntimeConfig()

router.get('/band/:_id', defineEventHandler(async (event) => {
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 404, message: 'Ошибка ID'})
    const band = await Band.findById(_id).populate(Band.getPopulation())
    if (!band) throw createError({statusCode: 404, message: 'Группа не найдена: ' + _id})
    return band.photos
}))

router.delete('/:_id', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    const {_id} = event.context.params as Record<string, string>

    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 404, message: 'Ошибка ID'})
    const photo = await Photo.findById(_id).populate(Photo.getPopulation())
    if (!photo) throw createError({statusCode: 404, message: 'Фото не найдено: ' + _id})
    const band = await Band.findOne({_id: photo.band.id, $or: [{user}, {shares: {$elemMatch: {$eq: user.id}}}]})
    if (!band) throw createError({statusCode: 403, message: 'Невозможно удалить фото'})
    await Photo.findByIdAndDelete(photo.id)
}))

router.put('/band/:_id/upload', defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) throw createError({statusCode: 403, message: 'Доступ запрещён',})
    const {_id} = event.context.params as Record<string, string>
    if (!Types.ObjectId.isValid(_id)) throw createError({statusCode: 406, message: 'Ошибочный id'})
    const band = await Band.findById(_id)
    if (!band) throw createError({statusCode: 406, message: 'Группа не найдена'})
    let files = await readMultipartFormData(event)
    if (!files) throw createError({statusCode: 406, message: 'Необходимо отправить файлы'})
    const photos = []
    for (const file of files) {
        const url = `https://api.imgbb.com/1/upload?key=${imgbbKey}`
        const url2 = '/api/my-band/test'
        const body = new FormData()
        body.append('image', file.data.toString('base64'))
        try {
            const response = await fetch(url, {method: 'POST', body})
            const {data, success} = await response.json()
            if (!success) throw createError({statusCode: 406, message: 'IMGBB'})
            //console.log(data)
            const photo = await Photo.create({image: data.image.url, thumb: data.thumb.url, band})
            photos.push(photo)
        } catch (e: any) {
            console.log(e)
            throw createError({statusCode: 400, message: 'Ошибка загрузки:' + e.message})
        }
    }
    return photos
}))

export default useBase('/api/photo', router.handler)
