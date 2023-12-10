import {defineStore} from 'pinia';

interface UserPayloadInterface {
    email: string;
    password: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedUser: null,
        loading: false,
    }),
    actions: {
        async getUser() {
            const {data}: any = await useNuxtApp().$GET('/user/checkAuth');
            this.loggedUser = data.value
        },
        async authenticateTelegram(body:Object) {
            const {data, pending}: any = await useNuxtApp().$POST('/user/telegram', body);
            if (!data.value) return
            this.loggedUser = data.value
            this.loading = pending;
            const router = useRouter();
            await router.push('/cabinet')
        },
        async authenticateUser({email, password}: UserPayloadInterface) {
            // useFetch from nuxt 3
            const {data, pending}: any = await useNuxtApp().$POST('/user/login', {email, password,});
            if (!data.value) return
            this.loggedUser = data.value
            this.loading = pending;
            const router = useRouter();
            await router.push('/cabinet')
        },
        async signupUser({email, password}: UserPayloadInterface) {
            // useFetch from nuxt 3
            const {data, pending}: any = await useNuxtApp().$PUT('/user/signup', {email, password,});
            this.loading = pending;
            this.loggedUser = data.value
            const router = useRouter();
            await router.push('/cabinet')
        },
        async logUserOut() {
            await useNuxtApp().$GET('/user/logout')
            this.loggedUser = null
            const router = useRouter();
            await router.push('/login')

        },
    },
});