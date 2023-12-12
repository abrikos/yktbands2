import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IUser} from "~/server/models/user.model";
import moment from "moment";

const Schema = mongoose.Schema;

export interface IPlace extends mongoose.Document {
    name: string,
    fullName: string,
    address: string,
    coordinate: [number, number],
    coordinateValid: boolean
}


const schema = new Schema({
        name: {type: String, require: true, unique: true},
        address: {type: String},
        coordinateX: Number,
        coordinateY: Number,
    },
    {
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

schema.statics.getPopulation = () => [
    {path: 'concerts', populate: {path: 'band', select: {logo: 1, name: 1}}},
]

schema.virtual('fullName')
    .get(function () {
        return `${this.name}, ${this.address}`;
    })

schema.virtual('coordinateValid')
    .get(function () {
        return this.coordinateX && this.coordinateY;
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


export const Place = defineMongooseModel('place', schema)