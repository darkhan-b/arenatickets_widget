<template>
  <div>
    <n-grid cols="2" x-gap="14" y-gap="14">
      <n-grid-item
        class="pay-method h-100 pointer"
        @click="handleInput(p.id)"
        v-for="(p, pind) in enabledPayMethods"
        :key="`av-pm-${pind}`">
        <n-space align="center" justify="space-between" class="h-100 spacer">
          <div class="pe-2">
            <img
              :src="`/images/${p.icon}`"
              class="pay-icon"
              :class="`pay-${p.id}`"
              alt="" />
            <div class="pay-method-title mt-2" v-if="p.title">
              {{ p.title }}
            </div>
          </div>
          <div class="pay-check" :class="{ active: p.id === modelValue }">
            <n-icon
              :component="CheckmarkSharp"
              v-if="p.id === modelValue"></n-icon>
          </div>
        </n-space>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup>
import { NSpace, NIcon, NGrid, NGridItem } from 'naive-ui'
import { CheckmarkSharp } from '@vicons/ionicons5'
import { useGeneralStore } from '~/stores/general.store'
const generalStore = useGeneralStore()

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  }
})

const availablePayMethods = [
  // { id: 'kaspi', icon: 'kaspi.svg' },
  { id: 'card', icon: 'card.png', title: translate('card_payment') },
  // { id: 'forum', icon: 'forum.png', title: translate('forum') },
  {
    id: 'cash',
    icon: 'cashregister.svg',
    title: translate('cashdesk'),
    permission: 'kassa'
  },
  {
    id: 'invitation',
    icon: 'invitation.svg',
    title: translate('invitations'),
    permission: 'invitation'
  }
]

const enabledPayMethods = computed(() => {
  return availablePayMethods.filter((p) => {
    if (p.permission) {
      return generalStore.hasPermission(p.permission)
    }
    return true
  })
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (val) => {
  emit('update:modelValue', val)
}

handleInput(enabledPayMethods.value[0].id)
</script>

<style scoped lang="scss">
.pay-method {
  background: #ffffff;
  border: 1px solid #e5e7ea;
  border-radius: 8px;
  padding: 12px 14px;
  img {
    max-width: 140px;
    &.pay-card {
      max-width: 110px;
    }
    &.pay-cash {
      max-width: 34px;
    }
    &.pay-invitation {
      max-width: 34px;
    }
  }
  .pay-method-title {
    font-size: 15px;
  }
  &:hover {
    background: #f6f6f6;
  }
}
.pay-check {
  border: 1px solid #7e8389;
  border-radius: 100%;
  display: inline-flex;
  justify-items: center;
  align-items: center;
  width: 22px;
  height: 22px;
  position: relative;
  background: transparent;
  font-size: 14px;
  i {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    max-width: 34px;
    color: #fff;
  }
  &.active {
    background: #c2020d;
    border: 1px solid #c2020d;
  }
}
.spacer {
  font-size: 0;
}
@media (max-width: 768px) {
  .pay-method {
    padding: 10px 12px;
    .pay-method-title {
      font-size: 12px;
    }
    img {
      max-width: 92px;
      &.pay-card {
        max-width: 92px;
      }
    }
  }
}
</style>
