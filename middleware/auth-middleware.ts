import {useAuthStore} from "~/store/auth-store";

export default defineNuxtRouteMiddleware((to) => {
    const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
    const token = useCookie<string>('auth'); // get token from cookies

/*
    if (token.value) {
        // check if value exists
        authenticated.value = true; // update the state to authenticated
    }

    // if token exists and url is /login redirect to homepage
    if (token.value && to?.name === 'login') {
        return navigateTo('/cabinet');
    }
*/

    // if token doesn't exist redirect to log in
    if (!token.value && to?.name !== 'login') {
        abortNavigation();
        return navigateTo('/login');
    }
});