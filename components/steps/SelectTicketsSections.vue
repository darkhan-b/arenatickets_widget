<template>
  <div class="position-relative h-100">
    <SchemeVenueScheme v-if="!section && scheme" />
    <div v-if="!loaded" class="text-center py-5">
      <n-spin size="large" />
    </div>
    <transition name="page">
      <div v-if="section" class="h-100">
        <SchemeSectionScheme view="user" v-if="sectionType === 'seats'" />
        <StepsSelectEnterSectionTicketsAmount v-if="sectionType === 'enter'" />
      </div>
    </transition>
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
const loaded = ref(true)

watch(section, async (val) => {
  if (val) {
    loaded.value = false
    const { data } = await useAPI(
      `timetable/${timetable.value.id}/section/${val.id}`
    )
    if (section.value) {
      // in case user pressed back before it was loaded
      sectionType.value = data.value.type
      section.value.seats = data.value.seats
      sectionTickets.value = data.value.tickets
      prices.value = data.value.prices
    }
    loaded.value = true
  } else {
    sectionType.value = null
    prices.value = []
    sectionTickets.value = []
  }
})
</script>
