<template>
  <div class="timetable-wrap">
    <template v-if="timetableAvailableForSale">
      <StepsSelectTicketsSections v-if="timetable.type === 'sections'" />
      <StepsSelectTicketsPricegroups
        v-if="
          timetable.type === 'pricegroups' &&
          timetable.show.ticket_design_id !== 9
        " />
      <StepsSelectTicketsForum
        v-if="
          timetable.type === 'pricegroups' &&
          timetable.show.ticket_design_id === 9
        " />
    </template>
    <template v-if="timetable.sale_starts_soon">
      <div class="alert alert-warning mx-5">{{ $t('sale_starts_soon') }}</div>
    </template>
    <template v-if="timetable.temporary_blocked">
      <div class="alert alert-warning mx-5">
        {{ $t('sales_temporary_blocked') }}
      </div>
    </template>
    <template v-if="timetable.salesFinished">
      <div class="alert alert-warning mx-5">{{ $t('sales_finished') }}</div>
    </template>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useShowStore } from '~/stores/show.store'
import { useSchemeStore } from '~/stores/scheme.store'

const route = useRoute()
const showStore = useShowStore()
const schemeStore = useSchemeStore()

const { timetable, ticketsSummary, timetableAvailableForSale, pricegroups } =
  storeToRefs(showStore)
const { scheme, section } = storeToRefs(schemeStore)

const { data } = await useAPI(`timetable/${route.params.timetableUUID}`)
timetable.value = data.value.timetable
ticketsSummary.value = data.value.tickets
pricegroups.value = data.value.tickets
scheme.value = data.value.timetable.scheme
</script>

<style lang="scss" scoped>
.timetable-wrap {
  height: 100%;
}
@media screen and (max-width: 768px) {
  .timetable-wrap {
    height: calc(100% - 90px);
  }
}
</style>
