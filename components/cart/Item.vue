<template>
  <div class="cart-item">
    <div class="row align-items-center">
      <div class="col">
        <div
          class="seat"
          v-if="
            !item.section_id ||
            !sectionsWithoutSeatSelection.includes(item.section_id)
          ">
          {{ item.seat }}
        </div>
        <div class="section text-muted">
          <n-space :size="8" align="center">
            <span>{{ item.section }}</span>
            <SharedSpot />
            <span>{{ formatPrice(item.price * discountedCoefficient) }}</span>
          </n-space>
        </div>
      </div>
      <div class="col-auto">
        <div class="price">
          <div
            v-if="discountedCoefficient < 1"
            style="
              text-decoration: line-through;
              color: #7e8389;
              font-size: 12px;
              font-weight: 400;
            ">
            {{ formatPrice(item.price) }}
          </div>
        </div>
      </div>
      <div class="col-auto" v-if="!order || !order.vendor">
        <a class="btn-grey squared" @click="deleteTicket">
          <n-icon
            :size="isMobile ? '16' : '24'"
            :style="!isMobile ? 'top: -2px' : ''"
            :component="CloseOutline"></n-icon>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NIcon, NSpace } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useCartStore } from '~/stores/cart.store'
import { useShowStore } from '~/stores/show.store'
import { CloseOutline } from '@vicons/ionicons5'
import { useGeneralStore } from '~/stores/general.store'

const cartStore = useCartStore()
const showStore = useShowStore()
const generalStore = useGeneralStore()

const { order, cart, discountedCoefficient } = storeToRefs(cartStore)
const { show, timetable } = storeToRefs(showStore)
const { isMobile } = storeToRefs(generalStore)

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const deleteTicket = () => {
  cartStore.updateCart({
    sign: '-',
    ticket: {
      seat_id:
        props.item.type && props.item.type === 'enter'
          ? null
          : props.item.seat_id,
      section_id: props.item.section_id,
      pricegroup_id: props.item.pricegroup_id
    }
  })
  if (props.item.order_item_id) {
    cartStore.deleteOrderItem(props.item.order_item_id)
  }
}

const sectionsWithoutSeatSelection = computed(() => {
  return (
    timetable.value?.sections_without_seat_selections?.map(
      (obj) => obj.section_id
    ) || []
  )
})
</script>
