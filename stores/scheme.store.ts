import { defineStore, storeToRefs } from 'pinia'
import { useCartStore } from '~/stores/cart.store'
import { useGeneralStore } from '~/stores/general.store'

export const useSchemeStore = defineStore('scheme', {
  state: () => ({
    venue: <any>null,
    scheme: <any>null,
    section: <any>null,
    schemeView: <string>'plan',
    sectionType: <string | null>null,
    pricegroups: <any[]>[]
  }),
  getters: {
    seats: (state) => {
      return state.section?.seats || []
    },
    rows() {
      const rowsTmp: any = {}
      this.seats.forEach((item: any) => {
        rowsTmp[item.row] = {
          y: getRowY(item),
          x: getRowX(item),
          title: getRowName(item)
        }
      })
      return rowsTmp
    },
    maxRow() {
      const rowsArray: number[] = Object.keys(this.rows).map((v) => Number(v))
      return rowsArray.length > 0 ? Math.max(...rowsArray) : 0
    },
    numberOfRows() {
      const rowsArray: number[] = Object.keys(this.rows).map((v) => Number(v))
      return rowsArray.length
    },
    maxW() {
      const seats = this.seats as any[]
      const widths = seats.map((seat: any) => seat.x)
      return Math.max(...widths) + 50
    },
    maxH() {
      const generalStore = useGeneralStore()
      const { isMobile } = storeToRefs(generalStore)
      const seats = this.seats as any[]
      const heights = seats.map((seat: any) => seat.y)
      return Math.max(...heights) + (isMobile.value ? 350 : 100) // in mobile we have bottom bar
    }
    // withoutTicketAmongSelectedSeats(): any {
    //   return this.selectedSeats.filter((x: any) => {
    //     const seat = this.seats.find((s: any) => s.id === x)
    //     return seat && !seat.ticket
    //   })
    // }
  },
  actions: {
    async seatPressed(seat: any) {
      if (!seat.id || !seat.ticket || seat.ticket.blocked || seat.ticket.sold) {
        return
      }
      const cartStore = useCartStore()
      const { selectedSeats } = storeToRefs(cartStore)
      let sign = selectedSeats.value.includes(seat.id) ? '-' : '+'
      let ticket = {
        price: seat.ticket.price,
        seat_id: seat.id,
        section_id: this.section.id,
        section_name: this.section.title,
        row: seat.row,
        seat: seat.seat,
        ticket_id: seat.ticket.id
      }
      cartStore.updateCart({ sign, ticket })

      // const exists = this.selectedSeats.includes(seat.id)
      // if (exists) {
      //   this.selectedSeats = this.selectedSeats.filter(
      //     (c: any) => c !== seat.id
      //   )
      // } else {
      //   this.selectedSeats.push(seat.id)
      // }
    },
    schemeUnmount() {
      this.section = null
      this.scheme = null
      this.venue = null
    }
  }
})

const getRowName = (rowItem: any): string => {
  const title = rowItem.row
  if (isNaN(title)) return title
  return `Ряд ${title}`
  // return `${t('row')} ${title}`
}

const getRowX = (rowItem: any) => {
  return 0
}
const getRowY = (rowItem: any) => {
  return rowItem.y
}
