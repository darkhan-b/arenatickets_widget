<template>
  <div class="position-relative h-100">
    <div v-for="p in Object.keys(pricegroups)" :key="`pid-${p.id}`">
      <SchemeForumForm
        v-if="!section && scheme"
        @mouseover="pricegroupHovered(p)"
        @mouseout="selectedPricegroup = null"
        :pricegroup="pricegroups[p]" />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useSchemeStore } from '~/stores/scheme.store'
import { useShowStore } from '~/stores/show.store'
import { NSpin } from 'naive-ui'

const schemeStore = useSchemeStore()
const showStore = useShowStore()
const { scheme, section, sectionType } = storeToRefs(schemeStore)
const { timetable, prices, sectionTickets } = storeToRefs(showStore)

const { pricegroups } = storeToRefs(showStore)

const selectedPricegroup = ref(null)

const pricegroupsArray = computed(() => {
  return Object.values(pricegroups.value).map((obj) => obj.pricegroup)
})

const pricegroupHovered = (pricegroupId) => {
  selectedPricegroup.value = pricegroups.value[pricegroupId]
}
</script>
