declare global {
  type EffectType = 'satiety' | 'energy' | 'health' | 'mood'

  interface ItemEffect {
    type: EffectType
    value: number
    duration?: number // 持续时长（秒）
    stackable?: boolean // 效果是否可叠加
  }

  interface InventoryItem {
    itemId: string
    quantity: number
    effects: ItemEffect[]
  }

  interface ItemPrototype {
    id: string
    name: string
    describe?: string
    icon?: string
    maxStack: number
    stackable: boolean
    effects: ItemEffect[]
    category?: string
  }
}

export {}
