<template>
  <div class="no-user-select text-center mt-5">
    <div>
      {{ $t('choose_tickets_in_sector') }}
      <b>{{ trans(section.title) }}</b>
    </div>
    <div>
      {{ $t('price') }}: <b>{{ formatNumber(sectionTickets[0].price) }} ₸</b>
    </div>
    <div class="text-center mt-3">
      <n-space :size="10" justify="center" align="center">
        <a
          class="plus-btn"
          :class="{ disabled: amount < 1 }"
          @click="changeAmount('-')"
          ><n-icon :component="RemoveOutline"></n-icon>
        </a>
        <n-h3 class="amount-span mb-0">{{ amount }}</n-h3>
        <a
          class="minus-btn"
          :class="{ disabled: amount >= max }"
          @click="changeAmount('+')"
          ><n-icon :component="AddOutline"></n-icon
        ></a>
      </n-space>
    </div>
  </div>
</template>

<script setup>
import { useSchemeStore } from '~/stores/scheme.store'
import { storeToRefs } from 'pinia'
import { useShowStore } from '~/stores/show.store'
import { useCartStore } from '~/stores/cart.store'
import { NIcon, NSpace, NH3 } from 'naive-ui'
import { AddOutline, RemoveOutline } from '@vicons/ionicons5'

const schemeStore = useSchemeStore()
const showStore = useShowStore()
const cartStore = useCartStore()
const { section } = storeToRefs(schemeStore)
const { sectionTickets } = storeToRefs(showStore)
const { cart, ticketsLimit } = storeToRefs(cartStore)

const amount = computed(() => {
  return cart.value.reduce(
    (a, v) => (v.section_id === section.value.id ? a + 1 : a),
    0
  )
})

const max = computed(() => {
  return Math.min(sectionTickets.value.length, ticketsLimit.value)
})

const changeAmount = (sign) => {
  if (sign === '+' && amount.value >= max.value) return
  if (sign === '-' && amount.value <= 0) return
  let ticket = {
    price: sectionTickets.value[0].price,
    section_id: section.value.id
  }
  if (sectionTickets.value[0].seat_id)
    ticket.seat_id = sectionTickets.value[0].seat_id
  ticket.section_name = section.value.title
  cartStore.updateCart({ sign, ticket })
}
</script>
