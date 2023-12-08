import {ofetch} from 'ofetch'
import { defu } from 'defu'
import type {UseFetchOptions} from "#app";
//import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin((_nuxtApp) => {
    function useCustomFetch<T> (url: string | (() => string), options: UseFetchOptions<T> = {}) {
        const userAuth = useCookie('token')
        const config = useRuntimeConfig()

        const defaults: UseFetchOptions<T> = {
            // set user token if connected
            headers: userAuth.value
                ? { Authorization: `Bearer ${userAuth.value}` }
                : {},

            onRequest (_ctx) {
                console.log('REQ', options.method, url, options.body)
                // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
            },
            onResponse (_ctx) {
                console.log('RES',options.method, url, _ctx.response._data)
                // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
            },

            onResponseError (_ctx) {
                // throw new myBusinessError()
            }
        }

        // for nice deep defaults, please use unjs/defu
        const params = defu(options, defaults)

        return useFetch(url, params)
    }
    return {
        provide:{
            async POST(path:String, body:Object){
                return useCustomFetch('/api'+path, {method: 'POST', body})
            },
            async PUT(path:String, body:Object){
                return useCustomFetch('/api'+path, {method: 'PUT', body})
            },
            async GET(path:String){
                return useCustomFetch('/api'+path, {method: 'GET'})
            },
            async DELETE(path:String){
                return useCustomFetch('/api'+path, {method: 'DELETE'})
            },
        }
    }
})