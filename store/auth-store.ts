import {defineStore} from 'pinia';
import type {IUser} from "~/server/models/user.model";

interface UserPayloadInterface {
    email: string;
    password: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedUser: undefined,
        loading: false,
        redirect: ''
    }) as { loggedUser: IUser | undefined, loading: boolean, redirect: string },
    actions: {
        setRedirect(path: string) {
            this.redirect = path
        },
        async getUser() {
            if (!this.loggedUser) {
                const {data}: any = await useNuxtApp().$GET('/user/checkAuth');
                this.loggedUser = data.value
                return data.value
            } else {
                return this.loggedUser
            }
        },
        async authenticateUser(body: UserPayloadInterface, strategy: string) {
            const {data}: any = await useNuxtApp().$POST(`/user/login/${strategy}`, body);
            if (!data.value) return
            this.loggedUser = data.value
            const router = useRouter();
            await router.push(this.redirect || '/cabinet')
        },
        async signupUser({email, password}: UserPayloadInterface) {
            // useFetch from nuxt 3
            const {data}: any = await useNuxtApp().$PUT('/user/signup', {email, password,});
            this.loggedUser = data.value
            const router = useRouter();
            await router.push('/cabinet')
        },
        async logUserOut() {
            await useNuxtApp().$GET('/user/logout')
            this.loggedUser = undefined
            const router = useRouter();
            this.redirect = ''
            await router.push('/login')

        },
    },
});