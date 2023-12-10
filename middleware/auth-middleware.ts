import { useAuthStore } from '~/store/authStore';
import {storeToRefs} from "pinia"; // import the auth store we just created
export default defineNuxtRouteMiddleware((to) => {
    const { loggedUser } = storeToRefs(useAuthStore());
    if (!loggedUser.value && to?.name !== 'login') {
        abortNavigation();
        return navigateTo('/login');
    }
});