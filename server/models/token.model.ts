import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';
import {IUser} from "~/server/models/user.model";

export interface IToken extends mongoose.Document {
    access_token: string;
    refresh_token: string;
    resetCode: string;
    maxAge: number
    user: IUser
}

const Schema = mongoose.Schema;

const schema = new Schema({
    access_token: {type: String},
    refresh_token: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    resetCode: {type: String},
    maxAge: {type: Number, default: 0},
}, {
    timestamps: {createdAt: 'createdAt'},
    toObject: {virtuals: true},
    // use if your results might be retrieved as JSON
    // see http://stackoverflow.com/q/13133911/488666
    toJSON: {virtuals: true}
})

schema.methods.refresh = async function () {
    this.access_token = 'auth' + Math.random().toString()
    await this.save()
}

schema.statics.deleteExpired = async function (maxAge) {
    const cutoff = new Date()
    cutoff.setSeconds(cutoff.getSeconds() - maxAge)
    await this.deleteMany({createdAt: {$lt: cutoff}})
}

schema.pre('save', function (next) {
    // do stuff
    this.refresh_token = this.access_token = 'auth' + Math.random().toString()
    next();
})

export const Token = defineMongooseModel('token', schema)
Token.find().then(res=>{
    console.log('Init token')
})
