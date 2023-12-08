import { defineMongooseModel } from '#nuxt/mongoose'

export const User = defineMongooseModel('User', {
    name: {
        type: String,
    },
    email: String
})