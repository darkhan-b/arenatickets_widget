import { translate, trans } from '~/utils/helpers'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      t: (key: string) => translate(key),
      trans: (object: any) => trans(object)
    }
  }
})
