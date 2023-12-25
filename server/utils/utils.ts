import {IUser} from "~/server/models/user.model";
import {H3Event} from "h3";
import {Token} from "~/server/models/token.model";
import nodemailer from "nodemailer";

const {mailUser, mailPassword} = useRuntimeConfig()

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: mailUser,
        pass: mailPassword,
    },
});

function sendMail(mailData: any) {
    mailData.from = mailUser
    return transporter.sendMail(mailData)
}

export default {
    sendMail,
    adaptUser(user: IUser) {
        if (user) {
            user.passwordHash = ''
            user.restorePassword = ''
        }
        return user
    },
    async setAuthToken(event: H3Event, user: IUser) {
        const {authExpiration, authTokenName} = useRuntimeConfig(event)
        const token = await Token.create({user})
        setCookie(event, authTokenName, token.access, {maxAge: authExpiration})
        return token
    },
    sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

}