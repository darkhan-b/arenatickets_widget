import { defineStore } from 'pinia'

export const useShowStore = defineStore('show', {
  state: () => ({
    timetable: <any>null,
    ticketsSummary: <any>{},
    sectionTickets: <any>[],
    prices: <any[]>[],
    pricegroups: <any[]>[],
    closedSections: <any[]>[]
  }),
  getters: {
    show: (state) => {
      return state.timetable?.show || null
    },
    venue: (state) => {
      return state.timetable?.venue || null
    },
    isByPricegroups: (state) => {
      return state.timetable?.type === 'pricegroups'
    },
    timetableAvailableForSale: (state) => {
      return (
        !state.timetable?.sale_starts_soon &&
        !state.timetable?.temporary_blocked &&
        !state.timetable?.salesFinished &&
        state.timetable?.active
      )
    }
  },
  actions: {}
})
