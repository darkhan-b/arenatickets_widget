import { defineStore } from 'pinia'
import { useShowStore } from '~/stores/show.store'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: <any[]>[],
    ticketsLimit: 50,
    promocodeDiscount: 0,
    orderSecondsLeft: 0,
    order: <any>null,
    orderCancelling: false,
    orderFormRef: null,
    refundable: false,
    source: <string | null>null,
    formData: {
      name: '',
      phone: '',
      email: '',
      pay_system: 'card',
      comment: '',
      show_to_organizer: true,
      pay_system_imitated: null
    }
  }),
  getters: {
    selectedSeats: (state) => {
      return state.cart.reduce(
        (a, o) => (o.seat_id && a.push(o.seat_id), a),
        []
      )
    },
    getCartOriginalSum: (state) => {
      return state.cart.reduce((a, o) => ((a = a + o.price * 1), a), 0)
    },
    getCartSum(): number {
      return this.getCartOriginalSum * this.discountedCoefficient
    },
    discountRate: (state): number => {
      const showStore = useShowStore()
      if (!showStore.timetable) return 0
      return Math.round(showStore.timetable.discount) / 100
    },
    discountedCoefficient(): number {
      return 1 - this.discountRate
    },
    serviceFee(): number {
      const showStore = useShowStore()
      if (!showStore.show || showStore.show.external_fee_value <= 0) return 0
      if (showStore.show.external_fee_type === 'absolute') {
        return Math.round(showStore.show.external_fee_value * this.cart.length)
      }
      if (showStore.show.external_fee_type === 'percent') {
        return (
          Math.round(showStore.show.external_fee_value * this.getCartSum) / 100
        )
      }
      return 0
    },
    totalWithFee(): number {
      return (
        this.getCartSum +
        this.serviceFee -
        this.getCartOriginalSum * (this.promocodeDiscount / 100)
      )
    },
    refundableFeePercent(): number {
      const showStore = useShowStore()
      return showStore.show?.refundable_fee || 0
    },
    refundableShouldBeChosen(): boolean {
      return this.refundableFeePercent > 0
    },
    refundableFee(state): number {
      if (!this.refundableShouldBeChosen) return 0
      if (!state.refundable) return 0
      return Math.round((this.refundableFeePercent * this.totalWithFee) / 100)
    },
    totalWithFeeAndRefundable(): number {
      return this.totalWithFee + this.refundableFee
    },
    cartSummary: (state) => {
      const { $t } = useNuxtApp()
      let arr: any = {}
      let sections: any = {}
      let pricegroups: any = {}
      state.cart.forEach((item: any) => {
        if (item.row && item.seat) {
          arr['seat_' + item.seat_id] = {
            order_item_id: item.order_item_id,
            section: trans(item.section_name),
            seat:
              $t('row') +
              ': ' +
              item.row +
              ', ' +
              $t('seat') +
              ': ' +
              item.seat,
            price: item.price,
            seat_id: item.seat_id,
            section_id: item.section_id,
            pricegroup_id: null,
            type: 'seats'
          }
          return
        }
        if (item.section_id) {
          sections[item.section_id] =
            (sections[item.section_id] ? sections[item.section_id] : 0) + 1
          for (let i = 1; i <= sections[item.section_id]; i++) {
            arr['section_' + item.section_id + '_' + i] = {
              order_item_id: item.order_item_id,
              section: trans(item.section_name),
              seat: $t('entrance'),
              seat_id: item.ticket_id,
              section_id: item.section_id,
              pricegroup_id: null,
              price: item.price,
              type: 'enter'
            }
          }
          return
        }
        if (item.pricegroup_id) {
          pricegroups[item.pricegroup_id] =
            (pricegroups[item.pricegroup_id]
              ? pricegroups[item.pricegroup_id]
              : 0) + 1
          for (let i = 1; i <= pricegroups[item.pricegroup_id]; i++) {
            arr['pg_' + item.pricegroup_id + '_' + i] = {
              order_item_id: item.order_item_id,
              section: trans(item.pricegroup_name),
              seat: $t('entrance'),
              seat_id: null,
              section_id: null,
              pricegroup_id: item.pricegroup_id,
              price: item.price,
              type: 'pricegroup'
            }
          }
        }
      })
      return arr
    }
  },
  actions: {
    updateCart({ sign, ticket }: { sign: any; ticket: any }) {
      if (sign === '+' && this.cart.length < this.ticketsLimit) {
        this.cart.push(ticket)
      }
      if (sign === '-') {
        const conditions = ['seat_id', 'section_id', 'pricegroup_id']
        let removed = false
        this.cart.forEach((item, index) => {
          if (!removed) {
            let found_prop = false
            conditions.forEach((cond) => {
              if (ticket[cond] && !removed && !found_prop) {
                found_prop = true
                if (item[cond] == ticket[cond]) {
                  removed = true
                  this.cart.splice(index, 1)
                }
              }
            })
          }
        })
      }
    },
    async generateOrder() {
      const showStore = useShowStore()
      const res = await useAPI('order/init', {
        method: 'POST',
        body: JSON.stringify({
          cart: this.cart,
          source: this.source,
          timetable_id: showStore.timetable.id,
          is_refundable: 1
        })
      })
      return res.data.value
    },
    async loadOrder(orderId: any, orderUUID: string) {
      const { data } = await useAPI(`order/${orderId}/${orderUUID}`)
      const showStore = useShowStore()
      const res = data.value.order
      this.cart = []
      if (!res) return
      this.order = res
      this.orderSecondsLeft = data.value.secondsLeft
      showStore.timetable = res.timetable
      res.order_items.forEach((item: any) => {
        let sign = '+'
        let seatId = item.vendor_seat_id
          ? String(item.vendor_seat_id)
          : item.seat_id
        let ticket = {
          order_item_id: item.id,
          ticket_id: item.vendor_seat_id ? item.vendor_seat_id : item.ticket_id,
          seat_id: seatId,
          section_id: item.section_id,
          row: item.row,
          seat: item.seat,
          price: item.original_price,
          pricegroup_id: item.pricegroup_id,
          pricegroup_name: item.pricegroup ? item.pricegroup.title : {},
          section_name: item.section ? item.section.title : {}
        }
        this.updateCart({ sign, ticket })
      })
    },
    async deleteOrderItem(id: any) {
      if (!this.order) return
      await useAPI(`order/${this.order.id}/${this.order.hash}/item/${id}`, {
        method: 'DELETE'
      })
      await this.loadOrder(this.order.id, this.order.hash)
    },
    async fillOrder() {
      return useAPI(`order/${this.order.id}/${this.order.hash}/fill`, {
        method: 'POST',
        body: { ...this.formData, timetable_id: this.order.timetable_id }
      })
    },
    async cancelOrder() {
      if (!this.order) return
      await useAPI(`order/${this.order.id}/${this.order.hash}`, {
        method: 'DELETE'
      })
      this.order = null
      this.cart = []
    },
    async checkPromocode(
      timetable_id: number,
      promocode: string,
      order_id: number
    ) {
      if (!promocode) {
        this.promocodeDiscount = 0
        return null
      }
      const { data, error } = await useAPI('promocode', {
        method: 'POST',
        body: JSON.stringify({
          timetable_id,
          order_id,
          promocode
        })
      })
      const errorMessage = processFetchError(error)
      if (errorMessage) {
        this.promocodeDiscount = 0
        return errorMessage
      }
      this.promocodeDiscount = data.value || 0
      return null
    }
  }
})
