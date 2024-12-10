import { useGeneralStore } from '~/stores/general.store'
import { storeToRefs } from 'pinia'
import { tokenService } from '~/utils/token.service'

export const useAPI = (request: any, opts: any = {}) => {
  const config = useRuntimeConfig()
  const generalStore = useGeneralStore()
  const { clientId, locale } = storeToRefs(generalStore)

  opts.headers = {
    'X-API-TOKEN': config.public.API_TOKEN,
    'X-CLIENT-ID': clientId.value,
    'Accept-Language': locale.value
  }

  const token = tokenService.getToken()
  if (token) {
    opts.headers['Authorization'] = `Bearer ${token}`
  }

  return useFetch(request, { baseURL: config.public.baseURL, ...opts })
}
