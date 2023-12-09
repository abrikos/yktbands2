import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IUser} from "~/server/models/user.model";
import {IPlace} from "~/server/models/place.model";
import {IBand} from "~/server/models/band.model";

const Schema = mongoose.Schema;

export interface IConcert extends mongoose.Document {
    place: IPlace
    begin: number
    user: IUser
    band: IBand,
    enabled: boolean
}


const schema = new Schema({
        place: {type: mongoose.Schema.Types.ObjectId, ref: 'place'},
        begin: {type: Number, require: true},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        band: {type: mongoose.Schema.Types.ObjectId, ref: 'band'},
        enabled: {type: Boolean, default: true}

    },
    {
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

schema.statics.getPopulation = () => [
    {path: 'band', select: {logo: 1, name: 1}},
    {path: 'place'},
]


export const Concert = defineMongooseModel('concert', schema)