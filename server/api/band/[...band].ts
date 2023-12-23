import {Types} from "mongoose";

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

export default useBase('/api/band', router.handler)
