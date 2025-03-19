<script setup lang="ts">
import { testMessages } from './mock-data'
import type { ChatMessage } from './utils'

const messages = ref<ChatMessage[]>(testMessages)
const activeUser = testMessages[0].to
</script>

<template>
  <div
    class="flex flex-col gap-2 p-3 [&_>div]:(bg-[#e2e1e4] text-[#232323] p-2 rounded) [&_>.self]:(bg-[#95EC69] text-[#232323] self-end)"
  >
    <div
      class="chat-message"
      v-for="d in messages"
      :class="{ self: d.to === activeUser }"
    >
      <div class="chat-message_avatar">
        <n-avatar></n-avatar>
      </div>
      <div class="chat-message_content">
        {{ d.content }}
      </div>
    </div>
  </div>
</template>
