import {IUser} from "~/server/models/user.model";

export default {
    maxAge: parseInt(process.env.AUTH_COOKIE_MAX_AGE as string),
    maxAgeRefresh: parseInt(process.env.AUTH_COOKIE_MAX_AGE_REFRESH as string),
    adaptUser(user:IUser){
        if(user) {
            user.passwordHash = ''
        }
        return user
    }
}