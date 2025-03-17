export interface ChatMessage {
  content: string
  from: string
  to: string
  time: number
}

export type ChatGender = 'male' | 'female' | 'secret'

export interface ChatUser {
  name: string
  nickname: string
  birthday: number
  gender: ChatGender
  mood: string
  signature?: string
  address?: string
}

export interface FriendRelation {
  user1Id: string // 用户ID（较小值）
  user2Id: string // 好友ID（较大值）
  createdAt: Date // 建立时间
}
