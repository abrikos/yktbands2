import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IUser} from "~/server/models/user.model";

const Schema = mongoose.Schema;

export interface IArtist extends mongoose.Document {
    id: string
    name: string
    instrument: string
    user: IUser
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

export const Artist = defineMongooseModel('artist', schema)