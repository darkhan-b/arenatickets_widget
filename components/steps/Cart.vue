<template>
  <div class="cart-wrapper" v-if="cart && cart.length > 0">
    <n-space vertical justify="space-between" class="h-100">
      <div>
        <div v-if="isMobile && mobileExpanded" class="pb-3">
          <h3>{{ $t('your_order') }}:</h3>
          <div
            v-for="c in Object.keys(cartSummary)"
            :class="{
              'cart-carousel-item': Object.keys(cartSummary).length > 1
            }"
            :key="`mob-c-${c}`">
            <CartItem :item="cartSummary[c]" />
          </div>
          <CartFeesList class="mt-3" />
        </div>

        <div class="row align-items-center">
          <div class="col">
            <h2 class="mb-0">
              {{ $t('tickets_of') }}: {{ cart.length
              }}<span class="d-inline d-md-none">
                | {{ formatPrice(totalWithFeeAndRefundable) }}</span
              >
            </h2>
          </div>
          <div class="col-auto" v-if="isMobile && order">
            <a @click="toggleMobileExpanded">
              {{ $t('details') }}
              <n-icon
                size="14"
                class="details-chevron"
                :class="{ mobileExpanded }"
                :component="ChevronDown"></n-icon>
            </a>
          </div>
        </div>

        <div class="pt-2" v-if="!isMobile || !order">
          <n-carousel
            :space-between="8"
            draggable
            :loop="false"
            :show-dots="false"
            :show-arrow="false"
            :direction="isMobile ? 'horizontal' : 'vertical'"
            slides-per-view="auto">
            <n-carousel-item
              v-for="c in Object.keys(cartSummary)"
              :class="{
                'cart-carousel-item': Object.keys(cartSummary).length > 1
              }"
              :key="`c-${c}`">
              <CartItem :item="cartSummary[c]" />
            </n-carousel-item>
          </n-carousel>
        </div>
      </div>

      <div>
        <div class="d-none d-md-block">
          <CartFeesList />

          <div class="fw-bold border-bottom-0">
            <div class="row align-items-center">
              <div class="col">{{ $t('total') }}</div>
              <div class="col-auto">
                {{ formatPrice(totalWithFeeAndRefundable) }}
              </div>
            </div>
          </div>
        </div>

        <div class="mt-md-3 mt-2">
          <n-button
            class="w-100"
            type="primary"
            @click="nextStep"
            :disabled="order && orderSecondsLeft <= 0"
            :loading="loading">
            {{ $t(btnTitle) }}
            <template v-if="order">(<CartCountdown />)</template>
          </n-button>
          <div
            v-if="order"
            class="small text-muted mt-2"
            v-html="$t('by_press_agree')"></div>
        </div>
      </div>
    </n-space>
    <n-modal v-model:show="showConditionsDialog">
      <StepsAcceptShowConditions @accepted="acceptedConditions" />
    </n-modal>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart.store'
import { storeToRefs } from 'pinia'
import { formatPrice } from '~/utils/helpers'
import { useShowStore } from '~/stores/show.store'
import {
  useDialog,
  NSpace,
  NButton,
  NCarousel,
  NCarouselItem,
  NIcon,
  NModal
} from 'naive-ui'
import { ChevronDown } from '@vicons/ionicons5'
import { useGeneralStore } from '~/stores/general.store'

const cartStore = useCartStore()
const showStore = useShowStore()
const generalStore = useGeneralStore()
const dialog = useDialog()
const router = useRouter()
const loading = ref(false)
const mobileExpanded = ref(false)
const showConditionsDialog = ref(false)
let conditionsAccepted = false

const {
  cart,
  cartSummary,
  totalWithFeeAndRefundable,
  order,
  formData,
  orderSecondsLeft,
  orderFormRef
} = storeToRefs(cartStore)
const { show, timetable } = storeToRefs(showStore)
const { isMobile, clientId } = storeToRefs(generalStore)

const nextStep = () => {
  if (!order.value) {
    initOrder()
    return
  }
  if (order.value) {
    fillOrder()
  }
}

const initOrder = async () => {
  loading.value = true
  try {
    const res = await cartStore.generateOrder()
    if (res.error) {
      dialog.error({
        title: translate('error'),
        content: res.error,
        positiveText: 'Ок'
      })
    }
    if (res.order) {
      router.push(`/${clientId.value}/o/${res.order.id}/${res.order.hash}`)
    }
  } finally {
    loading.value = false
  }
}

const acceptedConditions = () => {
  showConditionsDialog.value = false
  conditionsAccepted = true
  fillOrder()
}

const fillOrder = async () => {
  try {
    await orderFormRef.value?.validate()
  } catch (e) {
    return
  }
  const terms = show.value.show_term?.show_term_points || []
  if (
    terms.length &&
    !conditionsAccepted &&
    !['cash', 'invitation'].includes(formData.value.pay_system)
  ) {
    showConditionsDialog.value = true
    return
  }
  loading.value = true
  try {
    const { data, error } = await cartStore.fillOrder()
    const errorMessage = processFetchError(error)
    if (errorMessage) {
      dialog.error({
        title: translate('error'),
        content: errorMessage,
        positiveText: 'Ок'
      })
      return
    }
    if (data?.value?.redirect) {
      location.href = data.value.redirect
    }
  } finally {
    loading.value = false
  }
}

const toggleMobileExpanded = () => {
  mobileExpanded.value = !mobileExpanded.value
}

const btnTitle = computed(() => {
  if (order.value) return 'to_payment'
  if (timetable.value?.reservation_sale) return 'to_order'
  return 'buy'
})

const cardLength = computed(() => {
  return cart.value.length
})

watch(cardLength, async (val) => {
  if (val === 0) {
    mobileExpanded.value = false
  }
})
</script>

<style scoped lang="scss">
.details-chevron {
  color: #828282;
  transition: all 0.2s ease-in-out;
  &.mobileExpanded {
    transform: rotate(-180deg);
  }
}
</style>
