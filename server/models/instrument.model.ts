import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IPlace} from "~/server/models/place.model";
import {IBand} from "~/server/models/band.model";
import moment from "moment";
import {IArtist} from "~/server/models/artist.model";

const Schema = mongoose.Schema;
const name = 'instrument'

export interface IInstrument extends mongoose.Document {
    band: IBand,
    icons: string[]
    artist: IArtist
    dateHuman: string
}

interface InstrumentModel extends mongoose.Model<IInstrument> {
    getPopulation(): any
}

const schema = new Schema({
        band: {type: mongoose.Schema.Types.ObjectId, ref: 'band'},
        artist: {type: mongoose.Schema.Types.ObjectId, ref: 'artist'},
        icons:[String]
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
    {path: 'artist'},
]


export const Instrument = mongoose.model<IInstrument, InstrumentModel>(name, schema)