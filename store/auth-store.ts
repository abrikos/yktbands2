import {defineStore} from 'pinia';

interface UserPayloadInterface {
    email: string;
    password: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        authenticated: false,
        loading: false,
    }),
    actions: {
        async getUser() {
            const {data: user, pending}: any = await useNuxtApp().$GET('/user/checkAuth');
            this.user = user
            this.authenticated = !!user.value
            //this.setToken(token)
        },
        async authenticateUser({email, password}: UserPayloadInterface) {
            // useFetch from nuxt 3
            const {data, pending}: any = await useNuxtApp().$POST('/user/login', {email, password,});
            if (!data.value) return
            console.log('zzzzzzz', data.value)
            this.user = data.value.user
            this.loading = pending;
            const auth = useCookie('auth'); // useCookie new hook in nuxt 3
            this.authenticated = data.value.token.access_token === auth.value; // set authenticated  state value to true
            if (!this.authenticated) return
            const router = useRouter();
            await router.push('/cabinet')
        },
        async signupUser({email, password}: UserPayloadInterface) {
            // useFetch from nuxt 3
            const {data: token, pending}: any = await useNuxtApp().$POST('/user/signup', {email, password,});
            this.loading = pending;
            const auth = useCookie('auth'); // useCookie new hook in nuxt 3
            this.authenticated = token.value === auth.value; // set authenticated  state value to true
            if (!this.authenticated) return
            const router = useRouter();
            await router.push('/cabinet')
        },
        async logUserOut() {
            await useNuxtApp().$GET('/user/logout')
            this.user = null
            this.authenticated = false; // set authenticated  state value to false
            const router = useRouter();
            await router.push('/login')

        },
    },
});