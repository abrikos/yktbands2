import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IUser} from "~/server/models/user.model";
import {IPlace} from "~/server/models/place.model";
import {IBand} from "~/server/models/band.model";
import moment from "moment/moment";

const Schema = mongoose.Schema;

export interface IConcert extends mongoose.Document {
    place: IPlace
    begin: number
    band: IBand,
    enabled: boolean
    date: string
}


const schema = new Schema({
        place: {type: mongoose.Schema.Types.ObjectId, ref: 'place'},
        begin: {type: Number, require: true},
        band: {type: mongoose.Schema.Types.ObjectId, ref: 'band'},
        enabled: {type: Boolean, default: true}

    },
    {
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

schema.virtual('date')
    .get(function (this: { begin: number }) {
        return moment.unix(this.begin).format('YYYY-MM-DD HH:mm')
    })


schema.statics.getPopulation = () => [
    {path: 'band', select: {logo: 1, name: 1}},
    {path: 'place'},
]


export const Concert = defineMongooseModel('concert', schema)