<template>
  <div class="countdown">
    <span v-if="orderSecondsLeft > 0">{{ minutes }}:{{ seconds }}</span>
    <span v-if="orderSecondsLeft <= 0">{{ $t('passed') }}</span>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart.store'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
let timer = null

const { order, orderSecondsLeft } = storeToRefs(cartStore)

const minutes = computed(() => {
  return String(Math.floor(orderSecondsLeft.value / 60)).padStart(2, '0')
})

const seconds = computed(() => {
  return String(orderSecondsLeft.value % 60).padStart(2, '0')
})

const launchTimer = () => {
  if (timer) clearInterval(timer)
  if (order.value) {
    countdown()
    timer = setInterval(countdown, 1000)
  }
}

const countdown = () => {
  if (!order.value) return
  // const now = moment()
  // const end = moment(order.value.expiry_date)
  // orderSecondsLeft.value = Math.round(
  //   moment.duration(end.diff(now)).asSeconds()
  // )
  orderSecondsLeft.value-- // decided to reject using moment cause browser time might be manipulated
  if (orderSecondsLeft.value <= 0 && timer) clearInterval(timer)
}

launchTimer()

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>
