<template>
  <div class="pricegroups-wrapper mx-auto px-4 mt-5">
    <div v-for="p in Object.keys(pricegroups)" :key="`pid-${p.id}`">
      <StepsSelectPricegroupTicketsAmount
        @mouseover="pricegroupHovered(p)"
        @mouseout="selectedPricegroup = null"
        :pricegroup="pricegroups[p]" />
    </div>
    <div
      class="pricegroup-scheme mx-auto mt-5"
      v-if="timetable.reservation_sale">
      <SchemeVenueScheme
        view="highlight-sections"
        :selected-pricegroups="
          selectedPricegroup
            ? [selectedPricegroup.pricegroup]
            : pricegroupsArray
        " />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useShowStore } from '~/stores/show.store'

const showStore = useShowStore()
const { pricegroups, timetable } = storeToRefs(showStore)

const selectedPricegroup = ref(null)

const pricegroupsArray = computed(() => {
  return Object.values(pricegroups.value).map((obj) => obj.pricegroup)
})

const pricegroupHovered = (pricegroupId) => {
  selectedPricegroup.value = pricegroups.value[pricegroupId]
}
</script>
