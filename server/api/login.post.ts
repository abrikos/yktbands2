import {User} from "~/server/models/user.model";
import {Token} from "~/server/models/token.model";

export default defineEventHandler(async (event) => {
    const {email, password} = await readBody(event)
    const user = await User.findOne({email}).populate('tokens');
    // @ts-ignore
    if(user.checkPasswd(password)){
        const token = await Token.create({user})
        // @ts-ignore
        setCookie(event,'auth', token.access_token)
        setResponseStatus(event, 200)
    }else{
        setResponseStatus(event, 401)
    }

});
