import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { chatDB } from '@/db/chatDB'
import { type ChatUser } from '@/components/PhoneDisplay/ChatIf/utils'

export const useChatStore = defineStore('chat', () => {
  const activeUserId = ref('')

  const getActiveUser = async () => {
    return chatDB.getUserById(activeUserId.value)
  }

  return { activeUserId, getActiveUser }
})
