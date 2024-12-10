import { defineStore } from 'pinia'
import { tokenService } from '~/utils/token.service'
import { langService } from '~/utils/lang.service'

export const useGeneralStore = defineStore('general', {
  state: () => ({
    clientId: null,
    user: null,
    permissions: <string[]>[],
    isMobile: false,
    locale: 'ru',
    settings: <any>{},
    translations: {}
  }),
  getters: {
    hasPermission: (state) => {
      return (permission: string) => {
        return state.permissions.includes(permission)
      }
    },
    settingsValue: (state) => {
      return (key: string) => {
        if (!state.settings[key]) return ''
        return trans(state.settings[key].body)
      }
    }
  },
  actions: {
    setLang(lang: string) {
      this.locale = lang
      langService.saveLang(lang)
    },
    logout() {
      tokenService.destroyToken()
      this.user = null
    }
  }
})
