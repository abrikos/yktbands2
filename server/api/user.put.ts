//import {User} from "~/server/models.BAK/user.model";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    //const users = await User.create(body);
    return body;
});
