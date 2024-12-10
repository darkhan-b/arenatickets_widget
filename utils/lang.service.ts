const LANG_KEY = 'locale'

export const langService = {
  saveLang: (token: string) => {
    localStorage.setItem(LANG_KEY, token)
  },

  getLang: () => {
    return localStorage.getItem(LANG_KEY)
  },

  destroyLang: () => {
    return localStorage.removeItem(LANG_KEY)
  }
}
