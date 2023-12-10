import { useAuthStore } from '~/store/authStore';
import {storeToRefs} from "pinia"; // import the auth store we just created
export default defineNuxtRouteMiddleware((to) => {
    const { user } = storeToRefs(useAuthStore());
    if (!user.value && to?.name !== 'login') {
        abortNavigation();
        return navigateTo('/login');
    }
});