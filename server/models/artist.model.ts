import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IUser} from "~/server/models/user.model";
import {IInstrument} from "~/server/models/instrument.model";

const Schema = mongoose.Schema;

export interface IArtist extends mongoose.Document {
    id: string
    name: string
    instrument: string
    user: IUser,
    instruments: IInstrument[]
}


const schema = new Schema({
        name: {type: String, require: true, unique: true},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    },
    {
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

schema.virtual('instruments', {
    ref: 'instrument',
    localField: '_id',
    foreignField: 'artist',
    //options: {sort: {date: -1}}
})


export const Artist = defineMongooseModel('artist', schema)