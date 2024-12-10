<template>
  <div class="order-page">
    <n-skeleton v-if="loading || orderCancelling"></n-skeleton>
    <n-result
      v-if="!loading && !order && !orderCancelling"
      class="mt-5"
      status="404"
      :title="$t('order_not_found')"
      :description="$t('order_cancelled_or_timed_out')">
    </n-result>
    <n-space vertical :size="10" class="mt-4" v-if="order && !orderCancelling">
      <div class="fw-bold">{{ $t('one_pay_method') }}</div>
      <StepsChoosePayMethod v-model="formData.pay_system" />
      <div class="fw-bold mt-4">{{ $t('your_data') }}</div>
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-space vertical :size="8">
          <n-form-item path="name" :show-label="false">
            <n-input
              :placeholder="$t('name')"
              class="input-gray"
              step="10"
              v-model:value="formData.name" />
          </n-form-item>
          <n-form-item path="phone" :show-label="false">
            <vue-tel-input
              class="input-gray not-naive w-100"
              mode="auto"
              defaultCountry="kz"
              :inputOptions="{ placeholder: $t('phone'), showDialCode: true }"
              :validCharactersOnly="true"
              v-model="formData.phone">
            </vue-tel-input>
          </n-form-item>
          <!--          <n-form-item path="phone" :show-label="false">-->
          <!--            <input-->
          <!--              :placeholder="$t('phone')"-->
          <!--              v-maska-->
          <!--              data-maska="+7 7## ### ####"-->
          <!--              class="input-gray not-naive w-100"-->
          <!--              v-model="formData.phone" />-->
          <!--          </n-form-item>-->
          <n-form-item path="email" :show-label="false">
            <n-input
              placeholder="Email"
              step="10"
              class="input-gray"
              v-model:value="formData.email" />
          </n-form-item>
          <n-form-item
            :feedback="promocodeDiscount > 0 ? $t('promocode_found') : ''"
            path="promocode"
            :show-label="false"
            v-if="timetable.hasPromocodes">
            <n-input
              :status="promocodeDiscount > 0 ? 'success' : ''"
              @change="promoCodeChanged"
              :placeholder="$t('promocode')"
              class="input-gray"
              v-model:value="formData.promocode" />
          </n-form-item>
          <div
            class="fw-bold mt-4"
            v-if="
              generalStore.hasPermission('write_order_comments') ||
              generalStore.hasPermission('hide_orders_for_organizers') ||
              generalStore.hasPermission('imitate_pay_methods')
            ">
            {{ $t('additionally') }}
          </div>
          <n-form-item
            path="comment"
            :show-label="false"
            v-if="generalStore.hasPermission('write_order_comments')">
            <n-input
              :placeholder="$t('comment')"
              class="input-gray"
              v-model:value="formData.comment" />
          </n-form-item>
          <n-form-item
            path="pay_system_imitated"
            :show-label="true"
            :label="$t('imitate_pay_method')"
            v-if="generalStore.hasPermission('imitate_pay_methods')">
            <select
              class="input-gray form-control ps-3 border"
              v-model="formData.pay_system_imitated">
              <option :value="null">-</option>
              <option
                v-for="ipm in imitatedPayMethods"
                :key="`ipm-${ipm.value}`"
                :value="ipm.value">
                {{ ipm.label }}
              </option>
            </select>
          </n-form-item>
          <n-form-item
            path="show_to_organizer"
            :show-label="false"
            v-if="
              generalStore.hasPermission('hide_orders_for_organizers') &&
              formData.pay_system === 'invitation'
            ">
            <n-checkbox v-model:checked="formData.show_to_organizer">
              {{ $t('show_to_organizer') }}
            </n-checkbox>
          </n-form-item>
        </n-space>
      </n-form>
    </n-space>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useShowStore } from '~/stores/show.store'
import { useCartStore } from '~/stores/cart.store'
import { useSchemeStore } from '~/stores/scheme.store'
import { useGeneralStore } from '~/stores/general.store'
import {
  useMessage,
  useDialog,
  NSkeleton,
  NResult,
  NSpace,
  NInput,
  NForm,
  NFormItem,
  NCheckbox
} from 'naive-ui'

const emit = defineEmits(['validated'])
const route = useRoute()
const router = useRouter()
const message = useMessage()
const showStore = useShowStore()
const cartStore = useCartStore()
const generalStore = useGeneralStore()
const schemeStore = useSchemeStore()
const dialog = useDialog()

const { timetable, prices } = storeToRefs(showStore)
const {
  order,
  cart,
  formData,
  orderCancelling,
  orderFormRef,
  promocodeDiscount
} = storeToRefs(cartStore)
const { section, scheme, sectionType } = storeToRefs(schemeStore)
const { clientId } = storeToRefs(generalStore)
const loading = ref(true)
const formRef = ref(null)

const { $t } = useNuxtApp()

onMounted(async () => {
  scheme.value = null
  section.value = null
  prices.value = []
  sectionType.value = null
  await loadOrder()
  formData.value.name = order.value.name
  formData.value.phone = order.value.phone
  formData.value.email = order.value.email
  formData.value.promocode = ''
  formData.value.comment = ''
  formData.value.pay_system_imitated = null
  formData.value.show_to_organizer = true
  orderFormRef.value = formRef.value
})

const rules = {
  name: [{ required: true, message: $t('field_is_required') }],
  phone: [
    { required: true, message: $t('field_is_required') },
    { min: 15, message: $t('field_is_too_short') }
  ],
  email: [
    { required: true, message: $t('field_is_required') },
    { type: 'email', message: $t('email_format_is_wrong') }
  ]
}

const imitatedPayMethods = [
  { label: translate('by_card'), value: 'card' },
  { label: 'Kaspi', value: 'kaspi' },
  { label: translate('installment'), value: 'installment' }
]

const loadOrder = async () => {
  try {
    await cartStore.loadOrder(route.params.orderId, route.params.orderUUID)
  } finally {
    loading.value = false
  }
}

const cancelOrder = async () => {
  loading.value = true
  await cartStore.cancelOrder()
  message.success(translate('order_cancelled_successfully'))
  router.push(
    `/${clientId.value}/t/${timetable.value.show_id}/${timetable.value.uuid}`
  )
}

const promoCodeChanged = async (val) => {
  loading.value = true
  const errorMessage = await cartStore.checkPromocode(
    timetable.value.id,
    val,
    order.value.id
  )
  if (errorMessage) {
    dialog.error({
      title: translate('error'),
      content: errorMessage,
      positiveText: 'Ок'
    })
  }
  loading.value = false
}
</script>

<style scoped>
.order-page {
  padding-left: 30px;
  max-width: 494px;
}
@media screen and (max-width: 768px) {
  .order-page {
    padding-left: 0;
    padding-bottom: 200px;
  }
}
</style>
