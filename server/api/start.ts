//Artist.find().populate('instruments').then(console.log)

export default defineEventHandler(async(event) => {
    const bands = await Band.find({enabled: true})//.populate(Band.getPopulation())
    const concerts = await Concert.find({date: {$gt: new Date()}}).sort({date: -1}).populate(Concert.getPopulation())
    const artists = await Artist.find().sort('name').populate({path:'instruments', populate:[{path:'band'}]})
    return {
        bands,
        concerts,
        artists
    }
})