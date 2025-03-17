<template>
  <div class="flex gap-2 items-center text-sm">
    <span class="text-gray-400">{{ effectLabel }}</span>
    <span :class="valueClass">{{ formattedValue }}</span>
    <span v-if="hasDuration" class="text-gray-500 text-xs">
      ({{ durationText }})
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  effect: Object,
})

const effectMap = {
  satiety: '饱食度',
  energy: '体力',
  health: '健康',
  mood: '心情',
}

const effectLabel = computed(() => effectMap[props.effect.type] || '未知')
const formattedValue = computed(() =>
  props.effect.value > 0 ? `+${props.effect.value}` : props.effect.value
)
const valueClass = computed(() =>
  props.effect.value > 0 ? 'text-green-400' : 'text-red-400'
)
const hasDuration = computed(() => props.effect.duration > 0)
const durationText = computed(() => {
  if (!hasDuration.value) return ''
  const mins = Math.floor(props.effect.duration / 60)
  const secs = props.effect.duration % 60
  return `${mins}m${secs}s`
})
</script>
