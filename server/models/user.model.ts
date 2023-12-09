import {base64urlEncode} from "iron-webcrypto";
import {defineMongooseModel} from '#nuxt/mongoose'
import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    name: string;
    photo: string;
    passwordHash: string;
    email: string;
    checkPasswd:(passwd:string)=>boolean
}


const Schema = mongoose.Schema;
const validateEmail = function (email: string) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};
function md5(str:string){
    return base64urlEncode( str)
}


const schema = new Schema({
    nameStored:String,
    photo:String,
    passwordHash: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        required: true,
    }
})

schema.methods.checkPasswd = function (passwd:string) {
    return md5(passwd) === this.passwordHash;
}

schema.virtual('name')
    .get(function () {
        return this.nameStored || this.email;
    })
schema.virtual('password')
    .get(function () {
        return '----';
    })
    .set(function (value) {
        this.passwordHash = md5(value)
    })

schema.virtual('tokens', {
    ref: 'token',
    localField: '_id',
    foreignField: 'user'
})


export const User = defineMongooseModel('User', schema)