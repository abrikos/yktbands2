export default defineNuxtRouteMiddleware((to) => {
    const token = useCookie<string>('auth'); // get token from cookies
    if (!token.value && to?.name !== 'login') {
        abortNavigation();
        return navigateTo('/login');
    }
});