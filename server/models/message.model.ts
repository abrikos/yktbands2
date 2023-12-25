import mongoose from 'mongoose';
import {IBand} from "~/server/models/band.model";
import moment from "moment";
import {IUser} from "~/server/models/user.model";

const Schema = mongoose.Schema;
const name = 'message'

export interface IMessage extends mongoose.Document {
    date: string
    band: IBand,
    user: IUser
    text: string
}


const schema = new Schema({
        band: {type: mongoose.Schema.Types.ObjectId, ref: 'band'},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        text: {type:String, required: true, maxLength: 500}
    },
    {
        timestamps: {createdAt: 'createdAt'},
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

schema.virtual('date')
    .get(function (this: { createdAt: Date }) {
        return moment(this.createdAt).format('YYYY-MM-DD HH:mm')
    })


export const Message = mongoose.model<IMessage>(name, schema)