import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IPlace} from "~/server/models/place.model";
import {IBand} from "~/server/models/band.model";
import moment from "moment";

const Schema = mongoose.Schema;
const name = 'concert'

export interface IConcert extends mongoose.Document {
    place: IPlace
    date: Date
    hour: number
    band: IBand,
    enabled: boolean
    dateHuman: string
}

interface ConcertModel extends mongoose.Model<IConcert> {
    getPopulation(): any
}


const schema = new Schema({
        place: {type: mongoose.Schema.Types.ObjectId, ref: 'place'},
        date: {type: Date, require: true},
        band: {type: mongoose.Schema.Types.ObjectId, ref: 'band'},
        enabled: {type: Boolean, default: true},
        hour: {type: Number, default: 20},
        test: String
    },
    {
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

schema.virtual('dateHuman')
    .get(function (this: { date: Date, hour: number }) {
        return moment(this.date).add(this.hour, 'hours').format('YYYY-MM-DD HH:mm')
    })


schema.statics.getPopulation = () => [
    {path: 'band', select: {logo: 1, name: 1}},
    {path: 'place'},
]


export const Concert = mongoose.model<IConcert, ConcertModel>(name, schema)