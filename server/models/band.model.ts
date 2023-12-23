import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IUser} from "~/server/models/user.model";
import moment from "moment";
import {IInstrument} from "~/server/models/instrument.model";
import {IConcert} from "~/server/models/concert.model";
import {Ref} from "vue";

const Schema = mongoose.Schema;

export interface IBand extends mongoose.Document {
    name: string
    shortcut: string
    nameOrShortcut: string
    enabled: boolean
    instruments: IInstrument[]
    concerts: IConcert[]
    user: IUser,
    share: IUser[],
    logo: string
    shareCode: string
    youtube: string[]
    poster: string
    logoRnd: string
    posterRnd: string
}

export interface IBandResponse {
    data: Ref<IBand>
    refresh: any
    pending: any
}


const schema = new Schema({
        name: {type: String},
        shortcut: {type: String, unique: true},
        logo: {type: String},
        poster: {type: String},
        shareCode: {type: String},
        youtube: [{type: String}],
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        share: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
        enabled: {type: Boolean, default: false}
    },
    {
        timestamps: {createdAt: 'createdAt'},
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

schema.statics.getPopulation = () => [
    {path: 'user', select: {email: 1, fullName: 1, photo: 1}},
    {path: 'instruments', populate: 'artist', options: {sort: {'artist.name': -1}}},
    {path: 'concerts', populate: 'place'},
]

schema.virtual('date')
    .get(function (this: { createdAt: Date }) {
        return moment(this.createdAt).format('YYYY-MM-DD HH:mm')
    })
schema.virtual('posterRnd')
    .get(function (this: { poster: string }) {
        return this.poster + '?' + Math.random()
    })
schema.virtual('logoRnd')
    .get(function (this: { logo: string }) {
        return this.logo + '?' + Math.random()
    })
schema.virtual('nameOrShortcut')
    .get(function () {
        return this.name || this.shortcut || this.id
    })

schema.pre('save', function (next) {
    this.shortcut = moment().valueOf().toString()
    next();
})

schema.virtual('concerts', {
    ref: 'concert',
    localField: '_id',
    foreignField: 'band',
    options: {sort: {date: -1}}
})
schema.virtual('instruments', {
    ref: 'instrument',
    localField: '_id',
    foreignField: 'band',
    //options: {sort: {'artist.name': 1}}
})

export const Band = defineMongooseModel('band', schema)