<template>
  <div class="position-relative h-100">
    <SchemeZoomBlock
      :min-scale="0.4"
      :max-scale="2"
      :scale="scale"
      @scale="scale = $event" />
    <div class="scheme-price-bubbles" v-if="prices.length > 0">
      <div
        class="scheme-price-bubble"
        v-for="(p, pind) in prices"
        :key="`price-${pind}`">
        <span class="price-color" :class="`color-${pind}`"></span>
        <span>{{ formatNumber(p) }} ₸</span>
      </div>
    </div>

    <div
      class="venue-wrapper"
      :class="`view-${view} ${panEnabled ? 'overflow-hidden' : 'pan-disabled'}`"
      ref="venueWrapper"
      id="venueWrapper">
      <div
        class="seats-wrapper position-relative"
        :style="`width:${maxWScaled}px; height: ${maxH}px; ${
          panEnabled ? 'transition:none;' : 'transform: scale(' + scale + ')'
        }`"
        ref="vwRef"
        id="seats-wrapper">
        <n-popover
          v-for="(s, sind) in seats"
          :key="'seat-' + sind"
          :disabled="!s.ticket">
          <template #trigger>
            <div
              :class="[
                {
                  hasTicket: s.ticket && s.ticket.price,
                  selected: selectedSeats.includes(s.id),
                  sold: s.ticket && s.ticket.sold,
                  soldAsInvitation: s.ticket && s.ticket.soldAsInvitation,
                  blocked: s.ticket && s.ticket.blocked
                },
                s.ticket ? 'color-' + prices.indexOf(s.ticket.price) : ''
              ]"
              @click="seatPressed(s)"
              ref="seatRefs"
              :id="'seat-' + sind"
              class="seat"
              :style="`left: ${s.x}px; top: ${s.y}px;`">
              {{ s.seat }}
            </div>
          </template>
          <div v-if="s.ticket">
            <div>
              {{ $t('row') }} {{ s.row }}, {{ $t('seat') }} {{ s.seat }}
            </div>
            <n-h4 class="my-0">{{ formatPrice(s.ticket.price) }}</n-h4>
          </div>
        </n-popover>
        <div
          class="seat-row"
          @click="rowPressed(r)"
          v-for="r in Object.keys(rows)"
          :key="'row-' + r"
          :style="`top: ${rows[r].y}px; left: ${rows[r].x}px`">
          {{ rows[r].title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSchemeStore } from '@/stores/scheme.store'
import { storeToRefs } from 'pinia'
import { useShowStore } from '~/stores/show.store'
import { useCartStore } from '~/stores/cart.store'
import { NH4, NPopover } from 'naive-ui'

const props = defineProps({
  view: {
    type: String,
    default: 'user'
  }
})

const schemeStore = useSchemeStore()
const showStore = useShowStore()
const cartStore = useCartStore()
const { seats, rows, maxW, maxH } = storeToRefs(schemeStore)
const { selectedSeats } = storeToRefs(cartStore)
const { prices } = storeToRefs(showStore)

const panEnabled = ref(false)
const scale = ref(1)
const seatRefs = ref([])
const vwRef = ref(null)
const venueWrapper = ref(null)

const seatPressed = (seat) => {
  schemeStore.seatPressed(seat)
}

const rowPressed = (row) => {
  seats.value.forEach((item) => {
    if (item.row === row) seatPressed(item)
  })
}

const maxWScaled = computed(() => {
  if (scale.value < 1) return maxW.value
  return maxW.value * scale.value
})

onMounted(() => {
  const vwWidth = venueWrapper.value.clientWidth
  setTimeout(() => {
    if (maxWScaled.value > vwWidth) {
      scale.value = Math.max(
        0.5,
        venueWrapper.value.clientWidth / maxWScaled.value
      )
    }
  }, 100)
})
</script>
