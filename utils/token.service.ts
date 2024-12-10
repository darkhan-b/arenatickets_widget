const ID_TOKEN_KEY = 'api_token'

export const tokenService = {
  saveToken: (token: string) => {
    localStorage.setItem(ID_TOKEN_KEY, token)
  },

  getToken: () => {
    return localStorage.getItem(ID_TOKEN_KEY)
  },

  destroyToken: () => {
    return localStorage.removeItem(ID_TOKEN_KEY)
  }
}
