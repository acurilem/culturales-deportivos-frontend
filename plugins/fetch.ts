import { ofetch } from 'ofetch';
import { useLoadingStore } from '~/store/loadingStore';


export default defineNuxtPlugin((nuxtApp) => {
  const loadingStore = useLoadingStore()
  globalThis.$fetch = ofetch.create({
    async onRequest ({ request, options }) {
        loadingStore.startLoading()
        
        const token = useAuthStore().getToken
        if (token) {
            options.headers = { Authorization: `Bearer ${token}` }
            options.retry= 1
            options.retryDelay= 500// ms
            options.retryStatusCodes = [401]
        } /*else {
            useRouter().push("/logout")
            console.log('Not authenticated')
        }
        */
    },
    async onRequestError ({ error }) {
      console.error(error)
    },
    async onResponse({ request, response, options }) {
        loadingStore.stopLoading()
    },
  })
  return {
    provide: {
        fetchService: globalThis.$fetch,
    },
  };
})