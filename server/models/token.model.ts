import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';

export interface IToken extends mongoose.Document {
    access_token: string;
    refresh_token: string;
    resetCode: string;
    user: mongoose.Schema.Types.ObjectId
}
const Schema = mongoose.Schema;

const schema = new Schema({
    access_token: {type: String},
    refresh_token: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    resetCode: {type: String},
},{
    timestamps: {createdAt: 'createdAt'},
    toObject: {virtuals: true},
    // use if your results might be retrieved as JSON
    // see http://stackoverflow.com/q/13133911/488666
    toJSON: {virtuals: true}
})

schema.methods.refresh = async function() {
    this.access_token = 'auth'+Math.random().toString()
    await this.save()
}

schema.pre('save', function (next) {
    // do stuff
    this.refresh_token = this.access_token = 'auth'+Math.random().toString()
    next();
})

export const Token = defineMongooseModel('token', schema)