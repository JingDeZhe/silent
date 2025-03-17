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
