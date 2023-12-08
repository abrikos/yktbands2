//import {User} from "~/server/models.BAK/user.model";

export default defineEventHandler(async (event) => {
    //const users = await User.find();
    console.log('ZZZZZZ',event.context.cloudflare)
    return "{users}";
});
