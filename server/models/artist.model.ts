import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IArtist extends mongoose.Document {
    id: string
    name: string
    instrument: string

}


const schema = new Schema({
        name: {type: String, require: true},
        instrument: {type: String},
    },
    {
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

schema.statics.getPopulation = () => [
    {path: 'instruments', populate: 'band'},
]

schema.virtual('instruments', {
    ref: 'instrument',
    localField: '_id',
    foreignField: 'artist',
    options: {sort: {name: 1}}
})


export const Artist = defineMongooseModel('artist', schema)