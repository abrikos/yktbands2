import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IUser} from "~/server/models/user.model";
import moment from "moment";

const Schema = mongoose.Schema;

export interface IPlace extends mongoose.Document {
    name: string,
    address: string,
    coordinate: [number],
    enabled: boolean
}


const schema = new Schema({
        name: {type: String, require: true, unique: true},
        address: {type: String},
        coordinate: [{type: Number}],
        enabled: {type: Boolean, default: true}
    },
    {
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

schema.statics.getPopulation = () => [
    {path: 'user', select: {email: 1, fullName: 1, photo: 1}},
    {path: 'concerts', populate: {path: 'band', select: {logo: 1, name: 1}}},
]

schema.virtual('concerts', {
    ref: 'concert',
    localField: '_id',
    foreignField: 'place',
    options: {sort: {begin: 1}}
})


export const Place = defineMongooseModel('place', schema)