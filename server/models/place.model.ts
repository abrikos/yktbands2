import mongoose from 'mongoose';
import {IConcert} from "~/server/models/concert.model";
import {IUser} from "~/server/models/user.model";

const Schema = mongoose.Schema;

export interface IPlace extends mongoose.Document {
    name: string,
    fullName: string,
    address: string,
    coordinate: number[],
    coordinateValid: boolean
    concerts: IConcert[]
    user: IUser
}
interface PlaceModel extends mongoose.Model<IPlace>{
    getPopulation():any
}


const schema = new Schema({
        name: {type: String, require: true, unique: true},
        address: {type: String},
        coordinateX: Number,
        coordinateY: Number,
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    },
    {
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

schema.statics.getPopulation = () => [
    {path: 'concerts', populate: [{path: 'band', select: {logo: 1, name: 1}}, 'place']},
]

schema.virtual('fullName')
    .get(function () {
        return `"${this.name?.toUpperCase()}", ${this.address}`;
    })

schema.virtual('coordinateValid')
    .get(function () {
        return !!(this.coordinateX && this.coordinateY);
    })
schema.virtual('coordinate')
    .get(function () {
        return [this.coordinateX, this.coordinateY];
    })
    .set(function (value) {
        if (value.length !== 2) return
        this.coordinateX = value[0] * 1
        this.coordinateY = value[1] * 1
    })


schema.virtual('concerts', {
    ref: 'concert',
    localField: '_id',
    foreignField: 'place',
    options: {sort: {begin: 1}}
})


export const Place = mongoose.model<IPlace, PlaceModel>('place', schema)