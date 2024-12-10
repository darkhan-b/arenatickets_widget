<template>
  <div>
    <div class="pb-1" v-if="serviceFee > 0">
      <div class="row align-items-center">
        <div class="col">{{ $t('service_fee') }}</div>
        <div class="col-auto">
          <template v-if="show && show.external_fee_type === 'percent'"
            >{{ formatNumber(show.external_fee_value) }}%</template
          >
          <template v-else>{{ formatPrice(serviceFee) }}</template>
        </div>
      </div>
    </div>

    <div
      class="border-bottom-0 pb-1"
      v-if="refundableFee > 0 && refundableFeePercent > 0">
      <div class="row align-items-center">
        <div class="col">{{ $t('refundable_fee') }}</div>
        <div class="col-auto">{{ refundableFeePercent }}%</div>
      </div>
    </div>

    <div class="border-bottom-0 pb-1" v-if="promocodeDiscount > 0">
      <div class="row align-items-center">
        <div class="col">{{ $t('promocode') }}</div>
        <div class="col-auto text-primary">-{{ promocodeDiscount }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart.store'
import { storeToRefs } from 'pinia'
import { useShowStore } from '~/stores/show.store'

const cartStore = useCartStore()
const showStore = useShowStore()

const {
  cart,
  promocodeDiscount,
  refundableFeePercent,
  refundableFee,
  serviceFee
} = storeToRefs(cartStore)
const { show } = storeToRefs(showStore)
</script>
