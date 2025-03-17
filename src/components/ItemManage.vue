<template>
  <div class="item-manager w-[300px] p-6 bg-gray-800/80 rounded backdrop-blur">
    <div class="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
      <div v-for="item in items" :key="item.id" class="item-slot relative cursor-pointer group">
        <!-- 物品图标 -->
        <n-popover raw content-class="p-2 rounded shadow bg-dark text-white" arrow-class="bg-dark!" trigger="hover">
          <template #trigger>
            <div class="icon-wrapper p-2 bg-white/10 rounded-lg transition-transform hover:scale-105">
              <i :class="item.icon" class="text-4xl text-white/90" />
              <span v-if="item.stackable" class="quantity-badge">
                {{ item.maxStack }}
              </span>
            </div>
          </template>
          <div class="item-tooltip">
            <h3 class="text-golden font-kaiti mb-2">{{ item.name }}</h3>
            <div class="divider my-2 bg-white/10" />
            <p class="text-gray-300 text-sm leading-snug">{{ item.describe }}</p>

            <div v-for="(effect, idx) in item.effects" :key="idx" class="effect-item">
              <EffectDisplay :effect="effect" />
            </div>
          </div>
        </n-popover>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    items: ItemPrototype[]
  }>(),
  {
    items: () => [],
  }
)
</script>

<style lang="scss">
/* 自定义样式 */
.item-manager {
  --golden: #ffd700;
  --bg-tooltip: rgba(40, 40, 40, 0.95);
}

.icon-wrapper {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}

.quantity-badge {
  background-color: #ffd700;
  --at-apply: absolute right-1 bottom-1 text-xs font-bold text-white px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm;
}

.divider {
  height: 1px;
}

.text-golden {
  color: var(--golden);
}

.font-kaiti {
  font-family: "楷体", "STKaiti", cursive;
}
</style>
