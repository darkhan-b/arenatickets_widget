<template>
  <div class="pricegroup-row">
    <div class="row align-items-center">
      <div class="col">
        <div class="pricegroup-title">
          <div
            v-if="pricegroup.pricegroup.color"
            :style="`background-color: ${pricegroup.pricegroup.color}`"
            class="pricegroup-color"></div>
          {{ trans(pricegroup.pricegroup.title) }}
        </div>
        <div class="text-muted d-block d-md-none">
          {{ $t('left') }}: {{ formatNumber(pricegroup.cnt) }}
        </div>
      </div>
      <div class="col-3 col-lg-2 d-md-block d-none">
        <div class="text-muted">
          {{ $t('left') }}: {{ formatNumber(pricegroup.cnt) }}
        </div>
      </div>
      <div class="col-auto">
        <div class="pricegroup-price">
          {{ formatPrice(pricegroup.pricegroup.price) }}
        </div>
      </div>
      <div class="col-auto">
        <div class="d-flex align-items-center">
          <n-space :size="10" justify="center" align="center">
            <a
              class="plus-btn"
              :class="{ disabled: amount < 1 }"
              @click="changeAmount('-')"
              ><n-icon :component="RemoveOutline"></n-icon
            ></a>
            <n-h3 class="amount-span mb-0">{{ amount }}</n-h3>
            <a
              class="minus-btn"
              :class="{ disabled: amount > 1 }"
              @click="changeAmount('+')"
              ><n-icon :component="AddOutline"></n-icon
            ></a>
          </n-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart.store'
import { storeToRefs } from 'pinia'
import { NIcon, NH3, NSpace } from 'naive-ui'
import { AddOutline, RemoveOutline } from '@vicons/ionicons5'

const props = defineProps({
  pricegroup: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const { cart, ticketsLimit } = storeToRefs(cartStore)

const max = computed(() => {
  return Math.min(props.pricegroup.cnt, ticketsLimit.value)
})

const amount = computed(() => {
  return cart.value.reduce(
    (a, v) => (v.pricegroup_id === props.pricegroup.pricegroup.id ? a + 1 : a),
    0
  )
})

const changeAmount = (sign) => {
  if (sign === '+' && amount.value >= max.value) return
  if (sign === '-' && amount.value <= 0) return
  let ticket = {
    price: props.pricegroup.pricegroup.price,
    pricegroup_id: props.pricegroup.pricegroup.id
  }
  ticket.pricegroup_name = props.pricegroup.pricegroup.title
  cartStore.updateCart({ sign, ticket })
}
</script>
