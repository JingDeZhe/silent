import Dexie, { type Table } from 'dexie'
import type { FriendRelation } from './utils'

// 定义用户接口
interface User {
  id: string // 用户唯一标识
  username: string // 用户名
  avatar?: string // 头像URL
  createdAt: Date // 创建时间
}

// 定义消息接口
interface Message {
  id?: number // 自动生成的主键
  senderId: string // 发送者ID
  receiverId: string // 接收者ID
  content: string // 消息内容
  timestamp: Date // 发送时间
  isRead: boolean // 是否已读
}

// 定义数据库类
class ChatDB extends Dexie {
  users!: Table<User, string> // 用户表 (主键为string类型)
  messages!: Table<Message, number> // 消息表 (自增主键)
  friends!: Table<FriendRelation, [string, string]>

  constructor() {
    super('ChatDatabase')

    this.version(1).stores({
      users: 'id, username', // 索引用户ID和用户名
      messages: '++id, senderId, receiverId, timestamp', // 自增主键，发送/接收者索引
      friends: '[user1Id+user2Id], user1Id, user2Id, createdAt', // 组合主键
    })
  }

  // 用户管理方法 ---

  // 添加用户
  async addUser(user: User): Promise<string> {
    return this.users.add(user)
  }

  // 删除用户
  async deleteUser(userId: string): Promise<void> {
    return this.users.delete(userId)
  }

  // 获取所有用户
  async getAllUsers(): Promise<User[]> {
    return this.users.toArray()
  }

  // 根据ID获取用户
  async getUserById(userId: string): Promise<User | undefined> {
    return this.users.get(userId)
  }

  // 消息管理方法 ---

  // 发送消息
  async sendMessage(
    message: Omit<Message, 'id' | 'timestamp' | 'isRead'>
  ): Promise<number> {
    return this.messages.add({
      ...message,
      timestamp: new Date(),
      isRead: false,
    })
  }

  // 获取两个用户间的聊天记录（按时间排序）
  async getChatHistory(userA: string, userB: string): Promise<Message[]> {
    return this.messages
      .where('[senderId+receiverId]')
      .anyOf([
        [userA, userB],
        [userB, userA], // 双向查询
      ])
      .sortBy('timestamp')
  }

  // 标记消息为已读
  async markMessagesAsRead(messageIds: number[]): Promise<number> {
    return this.messages.where('id').anyOf(messageIds).modify({ isRead: true })
  }

  // 删除单条消息
  async deleteMessage(messageId: number): Promise<void> {
    return this.messages.delete(messageId)
  }

  // 添加好友关系
  async addFriend(userId: string, friendId: string): Promise<void> {
    const [user1Id, user2Id] = [userId, friendId].sort()

    if (user1Id === user2Id) {
      throw new Error('不能添加自己为好友')
    }

    const exists = await this.friends.get([user1Id, user2Id])
    if (!exists) {
      await this.friends.add({
        user1Id,
        user2Id,
        createdAt: new Date(),
      })
    }
  }

  // 删除好友关系
  async removeFriend(userId: string, friendId: string): Promise<void> {
    const [user1Id, user2Id] = [userId, friendId].sort()
    await this.friends
      .where('[user1Id+user2Id]')
      .equals([user1Id, user2Id])
      .delete()
  }

  // 获取用户所有好友
  async getFriends(userId: string): Promise<User[]> {
    // 查询用户参与的所有好友关系
    const relations = await this.friends
      .where('user1Id')
      .equals(userId)
      .or('user2Id')
      .equals(userId)
      .toArray()

    // 提取所有好友ID
    const friendIds = relations.map((rel) =>
      rel.user1Id === userId ? rel.user2Id : rel.user1Id
    )

    // 返回完整的用户对象
    return this.users.where('id').anyOf(friendIds).toArray()
  }
}

// 创建数据库实例
export const chatDB = new ChatDB()
