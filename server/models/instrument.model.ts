import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IBand} from "~/server/models/band.model";
import {IArtist} from "~/server/models/artist.model";

const Schema = mongoose.Schema;

export interface IInstrument extends mongoose.Document {
    band: IBand
    artist: IArtist
    icon: string,

}


const schema = new Schema({
        band: {type: mongoose.Schema.Types.ObjectId, ref: 'band'},
        artist: {type: mongoose.Schema.Types.ObjectId, ref: 'artist'},
        icon: String,
    },
    {
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

export const Instrument = defineMongooseModel('instrument', schema)
