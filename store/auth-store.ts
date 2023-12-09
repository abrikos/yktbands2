import {defineStore} from 'pinia';

interface UserPayloadInterface {
    email: string;
    password: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
    }),
    actions: {
        async getUser() {
            const {data, pending}: any = await useNuxtApp().$GET('/user/checkAuth');
            this.user = data.value
        },
        async authenticateUser({email, password}: UserPayloadInterface) {
            // useFetch from nuxt 3
            const {data, pending}: any = await useNuxtApp().$POST('/user/login', {email, password,});
            if (!data.value) return
            this.user = data.value
            this.loading = pending;
            const router = useRouter();
            await router.push('/cabinet')
        },
        async signupUser({email, password}: UserPayloadInterface) {
            // useFetch from nuxt 3
            const {data, pending}: any = await useNuxtApp().$PUT('/user/signup', {email, password,});
            this.loading = pending;
            this.user = data.value
            const router = useRouter();
            await router.push('/cabinet')
        },
        async logUserOut() {
            await useNuxtApp().$GET('/user/logout')
            this.user = null
            const router = useRouter();
            await router.push('/login')

        },
    },
});