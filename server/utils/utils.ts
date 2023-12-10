import {IUser} from "~/server/models/user.model";

export default {
    maxAge: 3600 * 48,
    adaptUser(user:IUser){
        if(user) {
            user.passwordHash = ''
        }
        return user
    }
}