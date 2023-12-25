import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IUser} from "~/server/models/user.model";
import moment from "moment";
import {IConcert} from "~/server/models/concert.model";
import {Ref} from "vue";
import {IArtist} from "~/server/models/artist.model";

const Schema = mongoose.Schema;

export interface IInstrument{artist:IArtist, icons:string[]}
export interface IBand extends mongoose.Document {
    [key:string]:any
    name: string
    shortcut: string
    enabled: boolean
    instruments: IInstrument[]
    concerts: IConcert[]
    user: IUser,
    shares: IUser[],
    logo: string
    shareCode: string
    youtube: string[]
    photos: string[]
    poster: string
    logoRnd: string
    posterRnd: string
    editLink: string
    viewLink: string
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
        photos: [{type: String}],
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        shares: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
        instruments: [{artist:{type: mongoose.Schema.Types.ObjectId, ref: 'artist'}, icons:[]}],
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
    {path: 'user', select: {email: 1, name: 1, avatarImage: 1}},
    {path: 'shares', select: {email: 1, name: 1, avatarImage: 1}},
    {path: 'instruments', populate: 'artist', options: {sort: {'artist.name': -1}}},
    {path: 'concerts', populate: 'place'},
]

schema.virtual('date')
    .get(function (this: { createdAt: Date }) {
        return moment(this.createdAt).format('YYYY-MM-DD HH:mm')
    })
schema.virtual('editLink')
    .get(function () {
        return `/my-band-${this.id}`
    })
schema.virtual('viewLink')
    .get(function () {
        return `/band-${this.id}`
    })
schema.virtual('posterRnd')
    .get(function () {
        return this.poster + '?' + Math.random()
    })
schema.virtual('logoRnd')
    .get(function () {
        return this.logo + '?' + Math.random()
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

export const Band = defineMongooseModel('band', schema)