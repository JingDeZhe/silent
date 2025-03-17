import { itemDB } from './items'

// 类型定义
type AttributeKey = EffectType | 'energy' // 明确可操作的属性类型
type StatusEffect = {
  id: string
  effect: ItemEffect
  timer?: number // 浏览器环境使用 number 类型
  duration: number
}

export class Character {
  // 基础属性（响应式对象）
  private _attributes = reactive({
    satiety: 100, // 饱食度 (0-100)
    energy: 100, // 体力值
    health: 100, // 健康值
    mood: 100, // 心情值
  })

  // 库存系统（响应式Map）
  private _inventory = reactive(new Map<string, InventoryItem>())

  // 生效中的状态效果
  private _activeEffects = reactive(new Map<string, StatusEffect>())

  constructor(
    public readonly id: string,
    public name: string,
    initialInventory: InventoryItem[] = []
  ) {
    initialInventory.forEach((item) => this.addItem(item.itemId, item.quantity))
  }

  /* 属性访问器 */
  get attributes() {
    return readonly(this._attributes)
  }

  get inventory() {
    return Array.from(this._inventory.values())
  }

  /* 库存管理方法 */
  addItem(itemId: string, quantity: number = 1): void {
    const proto = itemDB.get(itemId)
    if (!proto) throw new Error(`未知物品: ${itemId}`)

    const existing = this._inventory.get(itemId)

    if (proto.stackable && existing) {
      existing.quantity = Math.min(existing.quantity + quantity, proto.maxStack)
    } else {
      this._inventory.set(itemId, {
        itemId,
        quantity: Math.min(quantity, proto.maxStack),
        effects: [...proto.effects],
      })
    }
  }

  removeItem(itemId: string, quantity: number): boolean {
    const item = this._inventory.get(itemId)
    if (!item) return false

    item.quantity -= quantity
    if (item.quantity <= 0) {
      this._inventory.delete(itemId)
    }
    return true
  }

  /* 物品使用系统 */
  useItem(itemId: string, itemDB: Map<string, ItemPrototype>): boolean {
    const item = this._inventory.get(itemId)
    if (!item) return false

    const proto = itemDB.get(itemId)
    if (!proto) throw new Error('物品数据异常')

    // 应用所有效果
    proto.effects.forEach((effect) => {
      if (effect.duration) {
        this.applyStatusEffect(effect)
      } else {
        this.applyImmediateEffect(effect)
      }
    })

    // 消耗物品
    this.removeItem(itemId, 1)
    return true
  }

  /* 效果处理逻辑 */
  private applyImmediateEffect(effect: ItemEffect): void {
    this.modifyAttribute(effect.type, effect.value)
  }

  private applyStatusEffect(effect: ItemEffect): void {
    const effectId = `${effect.type}_${Date.now()}`

    // 防止重复生效
    if (this._activeEffects.has(effectId)) return

    // 立即应用一次
    this.applyImmediateEffect(effect)

    // 持续效果处理
    const status: StatusEffect = {
      id: effectId,
      effect: { ...effect },
      timer: setInterval(() => {
        this.applyImmediateEffect(effect)
      }, 1000),
      duration: effect.duration!,
    }

    // 自动移除计时器
    setTimeout(() => {
      this.removeStatusEffect(effectId)
    }, (effect.duration || 0) * 1000)

    this._activeEffects.set(effectId, status)
  }

  private removeStatusEffect(effectId: string): void {
    const effect = this._activeEffects.get(effectId)
    if (!effect) return

    clearInterval(effect.timer)
    this._activeEffects.delete(effectId)
  }

  /* 属性操作方法 */
  private modifyAttribute(attr: AttributeKey, delta: number): void {
    const current = this._attributes[attr]
    this._attributes[attr] = this.clampValue(current + delta)

    // 触发副作用检查
    this.checkAttributeSideEffects(attr)
  }

  private clampValue(value: number): number {
    return Math.max(0, Math.min(100, value))
  }

  /* 状态副作用检查 */
  private checkAttributeSideEffects(attr: AttributeKey): void {
    switch (attr) {
      case 'satiety':
        if (this._attributes.satiety <= 20) {
          console.warn(`${this.name} 处于饥饿状态!`)
          // 可触发其他负面效果...
        }
        break
      case 'health':
        if (this._attributes.health <= 0) {
          this.handleDeath()
        }
        break
    }
  }

  private handleDeath(): void {
    console.error(`${this.name} 已死亡!`)
    // 清空所有持续效果
    this._activeEffects.forEach((_, key) => this.removeStatusEffect(key))
  }

  /* 序列化方法 */
  serialize(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      attributes: { ...this._attributes },
      inventory: this.inventory,
      effects: Array.from(this._activeEffects.values()),
    })
  }

  /* 静态构造方法 */
  static deserialize(
    data: string,
    itemDB: Map<string, ItemPrototype>
  ): Character {
    const parsed = JSON.parse(data)
    const character = new Character(parsed.id, parsed.name)

    // 恢复属性
    Object.entries(parsed.attributes).forEach(([key, value]) => {
      if (key in character._attributes) {
        character._attributes[key as AttributeKey] = value as number
      }
    })

    // 恢复库存
    parsed.inventory.forEach((item: InventoryItem) => {
      character.addItem(item.itemId, item.quantity)
    })

    // 恢复持续效果（需要重新创建计时器）
    parsed.effects.forEach((effect: StatusEffect) => {
      character.applyStatusEffect(effect.effect)
    })

    return character
  }
}
