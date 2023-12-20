import {Types} from "mongoose";

const router = createRouter()

router.get('/all', defineEventHandler(async (event) => {
    // @ts-ignore
    return Band.find({enabled:true})//.populate(Band.getPopulation())
}))

router.get('/:_id/view', defineEventHandler(async (event) => {
    const {_id} = event.context.params as Record<string, string>
    const match = _id.match(/^short-(.+?)$/)
    if(match) {
        // @ts-ignore
        return Band.findOne({shortcut:match[1]}).populate(Band.getPopulation())
    }else{
        // @ts-ignore
        return Band.findById(_id).populate(Band.getPopulation())
    }
}))

export default useBase('/api/band', router.handler)
