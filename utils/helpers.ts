import { useGeneralStore } from '~/stores/general.store'
import { storeToRefs } from 'pinia'
import moment from 'moment'

export const trans = (obj: any) => {
  if (!obj) return ''
  const generalStore = useGeneralStore()
  const { locale } = storeToRefs(generalStore)
  return obj[locale.value] || obj.ru
}

export const translate = (key: string) => {
  const generalStore = useGeneralStore()
  const { translations } = storeToRefs(generalStore)
  return translations.value?.[key] || key
}

export const formatNumber = (string: number) => {
  return Number(string).toLocaleString('ru')
}

export const formatPrice = (string: number) => {
  return `${formatNumber(string)} ₸`
}

export const formatDateTime = (value: string, format = 'DD.MM.YYYY, HH:mm') => {
  if (value == '-') return value
  return value ? moment(value).format(format) : ''
}

export const formatDate = (value: string, format = 'DD.MM.YYYY') => {
  if (value == '-') return value
  return value ? moment(value).format(format) : ''
}

export const processFetchError = (error: any) => {
  const data = error?.value?.response?._data
  if (!data) return ''
  return data.message || data || ''
}

export const copyObject = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}

export const parseSort = (val: string) => {
  if (!val) return [null, null]
  return val.split('-')
}

export const parsePhone = (val: string) => {
  if (!val) return ''
  return '+' + val.replace(/\D/g, '')
}
