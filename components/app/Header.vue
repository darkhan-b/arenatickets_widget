<template>
  <header id="header">
    <div class="w-100">
      <div class="row align-items-center">
        <div class="col-md-3 col">
          <a v-if="!hasBackBtn" href="https://arenatickets.kz">
            <LogoSvg class="header-logo" />
          </a>
          <div v-if="hasBackBtn">
            <n-space align="center">
              <n-button @click="back" :loading="loading" class="btn-grey px-0">
                <n-icon
                  size="18"
                  v-if="!loading"
                  :component="ChevronBack"></n-icon>
              </n-button>
              <div v-if="section">
                <div>{{ $t('sector') }}</div>
                <h3>{{ trans(section.title) }}</h3>
              </div>
              <div v-if="order && !section">
                <div>{{ $t('fill_data') }}</div>
                <h3>{{ $t('order_checkout') }}</h3>
              </div>
            </n-space>
          </div>
        </div>
        <div class="col text-center" v-if="!isMobile">
          <StepsShowInfo />
        </div>
        <div class="col-md-3 text-end d-md-block d-none">
          <a
            :href="`tel:${parsePhone(generalStore.settingsValue('phone'))}`"
            class="text-white">
            {{ generalStore.settingsValue('phone') }}
          </a>
        </div>
        <div class="col-auto" v-if="user">
          <a @click="logout" class="pointer text-white">
            <n-icon size="18" :component="LogOutOutline"></n-icon>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useShowStore } from '~/stores/show.store'
import { storeToRefs } from 'pinia'
import { useSchemeStore } from '~/stores/scheme.store'
import { NIcon, NSpace, NButton, useMessage } from 'naive-ui'
import { LogOutOutline, ChevronBack } from '@vicons/ionicons5'
import LogoSvg from '~/assets/svg/logo.svg?component'
import { useGeneralStore } from '~/stores/general.store'
import { useCartStore } from '~/stores/cart.store'
import { parsePhone } from '~/utils/helpers'

const router = useRouter()
const message = useMessage()

const showStore = useShowStore()
const schemeStore = useSchemeStore()
const generalStore = useGeneralStore()
const cartStore = useCartStore()

const { isMobile, clientId, user } = storeToRefs(generalStore)
const { show, timetable } = storeToRefs(showStore)
const { section } = storeToRefs(schemeStore)
const { order, orderCancelling } = storeToRefs(cartStore)

const loading = ref(false)

const hasBackBtn = computed(() => {
  return section.value || order.value
})

const back = async () => {
  if (section.value && !order.value) {
    section.value = null
    return
  }
  if (order.value) {
    await cancelOrder()
  }
}

const cancelOrder = async () => {
  loading.value = true
  orderCancelling.value = true
  await cartStore.cancelOrder()
  await router.push(
    `/${clientId.value}/t/${timetable.value.show_id}/${timetable.value.uuid}`
  )
  message.success(translate('order_cancelled_successfully'))
  setTimeout(() => {
    loading.value = false
    orderCancelling.value = false
  }, 1000)
}

const logout = () => {
  if (confirm(translate('are_you_sure_you_want_to_logout'))) {
    generalStore.logout()
  }
}
</script>
