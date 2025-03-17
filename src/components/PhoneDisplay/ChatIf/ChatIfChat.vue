<script setup lang="ts">
import { testMessages } from './mock-data'
import type { ChatMessage } from './utils'

const messages = ref<ChatMessage[]>(testMessages)
const activeUser = testMessages[0].to
</script>

<template>
  <div class="flex flex-col gap-2 p-3 
    [&_>div]:(bg-[#303030] text-[#eeeeee] p-2 rounded) 
    [&_>.self]:(bg-[#61ac85] text-[#202020] self-end)">
    <div class="chat-message" v-for="d in messages" :class="{ self: d.to === activeUser }">{{ d.content }}</div>
  </div>
</template>