import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IPlace} from "~/server/models/place.model";
import {IBand} from "~/server/models/band.model";
import moment from "moment";

const Schema = mongoose.Schema;
const name = 'photo'

export interface IPhoto extends mongoose.Document {
    band: IBand,
    enabled: boolean
    image: string
    thumb: string
}

interface PhotoModel extends mongoose.Model<IConcert> {
    getPopulation(): any
}


const schema = new Schema({
        band: {type: mongoose.Schema.Types.ObjectId, ref: 'band'},
        enabled: {type: Boolean, default: true},
        image: String,
        thumb: String,
    },
    {
        timestamps: {createdAt: 'createdAt'},
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

schema.statics.getPopulation = () => [
    {path: 'band', select: {logo: 1, name: 1}},
]


export const Photo = mongoose.model<IPhoto, PhotoModel>(name, schema)