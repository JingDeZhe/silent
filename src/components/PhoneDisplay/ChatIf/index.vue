<script setup lang="ts">
type MenuType = 'chat' | 'users' | 'moment' | 'me'
type MenuItem = { name: MenuType, icon: string }

const menus = ref<MenuItem[]>([
  { name: 'chat', icon: 'i-tabler:message' },
  { name: 'users', icon: 'i-tabler:users' },
  { name: 'moment', icon: 'i-tabler:aperture' },
  { name: 'me', icon: 'i-tabler:user' },
])
const status = ref<{ activeMenu: MenuType }>({
  activeMenu: 'chat'
})

function handleChangeMenu({ name }: MenuItem) {
  status.value.activeMenu = name
}
</script>

<template>
  <div class="chat-if bg-dark h-full w-full lg:(h-[600px] w-[300px] p-1 pt-2 pb-2 rounded-lg) box-border">
    <div class="bg-white h-full rounded flex flex-col">
      <n-scrollbar class="flex-1 h-full">
        <ChatIfChat v-if="status.activeMenu === 'chat'"></ChatIfChat>
        <ChatIfUsers v-else-if="status.activeMenu === 'users'"></ChatIfUsers>
        <ChatIfMoment v-else-if="status.activeMenu === 'moment'"></ChatIfMoment>
        <ChatIfMe v-else-if="status.activeMenu === 'me'"></ChatIfMe>
      </n-scrollbar>
      <div
        class="flex items-center justify-between p-3 text-[30px] bg-[#1e131d] text-[#e2e1e4] [&_>.active]:(text-[#fb8b05])">
        <i v-for="d in menus" :key="d.name" class="transition-100"
          :class="[d.icon, { active: status.activeMenu === d.name }]" @click="handleChangeMenu(d)"></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>