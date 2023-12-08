import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    access_token: {type: String},
    refresh_token: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    resetCode: {type: String},
})

schema.methods.refresh = async function() {
    this.access_token = Math.random().toString()
    await this.save()
}

schema.pre('save', function (next) {
    // do stuff
    this.refresh_token = this.access_token = Math.random().toString()
    next();
})

export const Token = defineMongooseModel('token', schema)