import { fruits } from './data-items/fruits'
import { snacks } from './data-items/snacks'
import { stapleFoods } from './data-items/staple-foods'

export class ItemDB {
  // 使用Map存储物品原型，提升查询性能
  private items = new Map<string, ItemPrototype>()

  /* 核心操作方法 */

  /**
   * 添加/更新物品原型
   * @param item 物品原型数据
   * @throws 当ID重复时抛出错误
   */
  add(item: ItemPrototype): void {
    if (this.items.has(item.id)) {
      throw new Error(`物品ID冲突: ${item.id}`)
    }
    this.items.set(item.id, this.validateItem(item))
  }

  /**
   * 批量加载物品数据
   * @param items 物品原型数组
   * @param overwrite 是否覆盖已有数据
   */
  loadFromArray(items: ItemPrototype[], overwrite = false): void {
    items.forEach((item) => {
      if (!overwrite && this.items.has(item.id)) return
      this.items.set(item.id, this.validateItem(item))
    })
  }

  /**
   * 获取物品原型
   * @param itemId 物品ID
   * @returns 不存在时返回undefined
   */
  get(itemId: string): ItemPrototype | undefined {
    return this.items.get(itemId)
  }

  /**
   * 检查物品是否存在
   * @param itemId 物品ID
   */
  has(itemId: string): boolean {
    return this.items.has(itemId)
  }

  /**
   * 删除物品原型
   * @param itemId 物品ID
   */
  delete(itemId: string): boolean {
    return this.items.delete(itemId)
  }

  /* 数据验证 */

  /**
   * 验证物品数据完整性
   * @param item 待验证物品
   * @throws 当数据不合法时抛出错误
   */
  private validateItem(item: ItemPrototype): ItemPrototype {
    // 必需字段检查
    const requiredFields: (keyof ItemPrototype)[] = [
      'id',
      'name',
      'maxStack',
      'stackable',
      'effects',
    ]
    requiredFields.forEach((field) => {
      if (item[field] === undefined) {
        throw new Error(`物品 ${item.id} 缺少必需字段: ${field}`)
      }
    })

    // 堆叠逻辑验证
    if (item.stackable && item.maxStack < 2) {
      throw new Error(`物品 ${item.id} 可堆叠但最大堆叠数小于2`)
    }

    // 效果验证
    item.effects.forEach((effect) => {
      this.validateEffect(effect)
    })

    return item
  }

  /**
   * 验证效果数据合法性
   * @param effect 物品效果
   */
  private validateEffect(effect: ItemEffect): void {
    const validTypes: EffectType[] = ['satiety', 'energy', 'health', 'mood']
    if (!validTypes.includes(effect.type)) {
      throw new Error(`无效的效果类型: ${effect.type}`)
    }

    if (typeof effect.value !== 'number') {
      throw new Error(`效果值必须为数字，当前值: ${effect.value}`)
    }

    if (effect.duration && effect.duration < 0) {
      throw new Error(`持续时间不能为负数: ${effect.duration}`)
    }
  }

  /* 实用查询方法 */

  /**
   * 按名称搜索物品（不区分大小写）
   * @param keyword 名称关键词
   * @returns 匹配的物品数组
   */
  searchByName(keyword: string): ItemPrototype[] {
    const regex = new RegExp(keyword, 'i')
    return Array.from(this.items.values()).filter((item) =>
      regex.test(item.name)
    )
  }

  /**
   * 按效果类型筛选物品
   * @param effectType 要筛选的效果类型
   * @returns 包含该效果的物品数组
   */
  filterByEffect(effectType: EffectType): ItemPrototype[] {
    return Array.from(this.items.values()).filter((item) =>
      item.effects.some((e) => e.type === effectType)
    )
  }

  /**
   * 获取所有物品原型数组
   */
  getAllItems(): ItemPrototype[] {
    return Array.from(this.items.values())
  }

  /* 数据统计 */

  /**
   * 获取物品类型统计
   * @returns 各分类的物品数量统计
   */
  getCategoryStats(): Record<string, number> {
    const stats: Record<string, number> = {}
    this.items.forEach((item) => {
      const category = item.category || '未分类'
      stats[category] = (stats[category] || 0) + 1
    })
    return stats
  }
}

export const itemDB = new ItemDB()
itemDB.loadFromArray(fruits)
itemDB.loadFromArray(snacks)
itemDB.loadFromArray(stapleFoods)
