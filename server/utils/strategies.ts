import {BinaryLike} from "node:crypto";
import crypto from "crypto";
import {IUser, User} from "~/server/models/user.model";
import {IToken, Token} from "~/server/models/token.model";
import {EventHandlerRequest, H3Event} from "h3";

interface IStrategy {
    [key: string]: (event: H3Event<EventHandlerRequest>) => Promise<IUser | undefined>
}

const {telegramBotToken} = useRuntimeConfig()
export const strategies: IStrategy = {
    async password(event: H3Event) {
        const {email, password} = await readBody(event)
        const user: IUser | null = await User.findOne({email});
        if (user?.checkPasswd(password)) {
            return user
        }
    },
    async telegram(event: H3Event) {
        const body = await readBody(event)
        const {username, first_name, last_name, photo_url} = body
        const email = username + '@telegram.org'
        const TOKEN: BinaryLike = telegramBotToken as BinaryLike;
        const secret = crypto.createHash('sha256')
            .update(TOKEN)
            .digest();

        function checkSignature(body: any) {
            const {hash, ...data} = body
            const {returnUrl, strategy, ...rest} = data;
            const checkString = Object.keys(rest)
                .sort()
                .filter(k => data[k])
                .map(k => (`${k}=${data[k]}`))
                .join('\n');
            const hmac = crypto.createHmac('sha256', secret)
                .update(checkString)
                .digest('hex');
            return hmac === hash
        }

        if (checkSignature(body)) {
            let user = await User.findOne({strategyId: body.id, strategy: 'telegram'})
            if (!user) {
                //return User.updateOne({avatarImage: body.photo_url},{strategyId: body.id})
                return User.create({
                    strategy: 'telegram',
                    name: first_name + ' ' + last_name,
                    avatarImage: photo_url,
                    email,
                })
            }
            return user
        }
    }
}