<template>
  <n-card
    style="width: 600px"
    :title="$t('confirm_terms_acceptance')"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true">
    <n-checkbox-group v-model:value="checkedTerms">
      <div v-for="term in terms" :key="`term-${term.id}`" class="mb-3">
        <n-checkbox :value="term.id">
          {{ trans(term.title) }}
        </n-checkbox>
      </div>
    </n-checkbox-group>
    <div class="text-end mt-3">
      <n-button
        type="primary"
        class="px-5"
        @click="accept"
        :disabled="!allAccepted"
        >{{ $t('accept_terms') }}</n-button
      >
    </div>
  </n-card>
</template>

<script setup>
import { NCard, NButton, NCheckboxGroup, NCheckbox } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useShowStore } from '~/stores/show.store'

defineProps({
  showConditionsDialog: {
    type: Boolean
  }
})

const emit = defineEmits(['accepted'])

const showStore = useShowStore()

const { show } = storeToRefs(showStore)
const terms = show.value.show_term?.show_term_points || []

const checkedTerms = ref([])

const allAccepted = computed(() => {
  return checkedTerms.value.length === terms.length
})

const accept = () => {
  emit('accepted')
}
</script>
