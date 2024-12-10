<template>
  <div class="container mt-5">
    <n-result
      v-if="result === 'failure'"
      status="error"
      :title="$t('error')"
      :description="$t('payment_failed')">
      <template #footer>
        <n-button @click="moveToTimetable">{{
          $t('return_to_purchase')
        }}</n-button>
      </template>
    </n-result>
    <n-result
      v-if="result === 'success'"
      status="success"
      :title="$t('success')"
      :description="$t('payment_success_tickets_will_be_sent')">
      <template #footer>
        <n-button @click="moveToTimetable">{{
          $t('return_to_purchase')
        }}</n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { NResult, NButton } from 'naive-ui'

const route = useRoute()
const router = useRouter()

const result = route.query.res
const clientId = route.params.clientId
const orderId = route.params.orderId
const orderHash = route.params.orderHash
const timetableId = route.query.tid
const timetableHash = route.query.thash

const moveToTimetable = async () => {
  if (result !== 'success') {
    try {
      await useAPI(`order/${orderId}/${orderHash}`, {
        method: 'DELETE'
      })
    } catch (e) {
      console.log(e)
    }
  }
  await router.push(`/${clientId}/t/${timetableId}/${timetableHash}`)
}
</script>
