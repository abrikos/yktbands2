import mongoose from 'mongoose';
import {IUser} from "~/server/models/user.model";
import moment from "moment";
import {IConcert} from "~/server/models/concert.model";
import {IArtist} from "~/server/models/artist.model";
import {IMessage} from "~/server/models/message.model";
import {IInstrument} from "~/server/models/instrument.model";
import {IPhoto} from "~/server/models/photo.model";


const Schema = mongoose.Schema;

export interface IBand extends mongoose.Document {
    [key: string]: any

    name: string
    shortcut: string
    enabled: boolean
    instruments: IInstrument[]
    messages: IMessage[]
    concerts: IConcert[]
    user: IUser
    shares: IUser[]
    logo: string
    shareCode: string
    about: string
    colorBanner: string
    colorText: string
    youtube: string[]
    photos: IPhoto[]
    poster: string
    logoRnd: string
    posterRnd: string
    editLink: string
    viewLink: string
}

interface BandModel extends mongoose.Model<IBand> {
    getPopulation(): any
}


const schema = new Schema({
        name: {type: String},
        shortcut: {type: String, unique: true},
        logo: {type: String},
        poster: {type: String},
        colorBanner: {type: String, default: 'wheat'},
        colorText: {type: String, default: 'black'},
        about: {type: String},
        shareCode: {type: String},
        youtube: [{type: String}],
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        shares: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
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
    {path: 'user', select: {email: 1, nameStored: 1, avatarImage: 1}},
    {path: 'instruments', populate: {path: 'artist'}},
    {path: 'messages', populate: {path: 'user'}},
    {path: 'concerts', populate: 'place'},
    {path: 'photos'},
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
schema.virtual('instruments', {
    ref: 'instrument',
    localField: '_id',
    foreignField: 'band',
    options: {sort: {name: 1}}
})

schema.virtual('messages', {
    ref: 'message',
    localField: '_id',
    foreignField: 'band',
    options: {sort: {createdAt: 1}}
})

schema.virtual('photos', {
    ref: 'photo',
    localField: '_id',
    foreignField: 'band',
    options: {sort: {createdAt: 1}}
})

export const Band = mongoose.model<IBand, BandModel>('band', schema)