import {useAuthStore} from '~/store/auth-store';
import {storeToRefs} from "pinia"; // import the auth store we just created
export default defineNuxtRouteMiddleware(async (to) => {
    const {getUser, setRedirect} = useAuthStore();
    const authPages = ['my-band-id', 'my-bands', 'cabinet', 'admin']
    const loggedUser = await getUser()
    if (authPages.includes(to.name as string) && !loggedUser) {
        setRedirect(to.fullPath)
        abortNavigation();
        return navigateTo('/login');
    }
});