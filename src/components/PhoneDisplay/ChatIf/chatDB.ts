import Dexie, { type Table } from 'dexie'

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

  constructor() {
    super('ChatDatabase')

    this.version(1).stores({
      users: 'id, username', // 索引用户ID和用户名
      messages: '++id, senderId, receiverId, timestamp', // 自增主键，发送/接收者索引
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
}

// 创建数据库实例
export const db = new ChatDB()

// 示例用法
async function exampleUsage() {
  // 添加用户
  await db.addUser({
    id: 'user1',
    username: 'Alice',
    createdAt: new Date(),
  })

  await db.addUser({
    id: 'user2',
    username: 'Bob',
    createdAt: new Date(),
  })

  // 发送消息
  await db.sendMessage({
    senderId: 'user1',
    receiverId: 'user2',
    content: '你好，Bob!',
  })

  // 获取聊天记录
  const history = await db.getChatHistory('user1', 'user2')
  console.log('聊天记录:', history)

  // 标记消息为已读
  if (history.length > 0) {
    await db.markMessagesAsRead(history.map((m) => m.id!))
  }

  // 获取所有用户
  const users = await db.getAllUsers()
  console.log('所有用户:', users)
}

// 初始化测试
exampleUsage().catch((err) => console.error('数据库操作错误:', err))
