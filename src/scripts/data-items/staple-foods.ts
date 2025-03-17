export const stapleFoods: ItemPrototype[] = [
  {
    id: 'bread',
    name: '全麦面包',
    describe: '高纤维健康面包',
    maxStack: 4,
    stackable: true,
    effects: [
      { type: 'satiety', value: 30 },
      { type: 'energy', value: 5 },
    ],
    category: 'staple-food',
  },
  {
    id: 'rice_ball',
    name: '饭团',
    describe: '日式三角饭团，便携主食',
    maxStack: 3,
    stackable: false,
    effects: [
      { type: 'satiety', value: 25 },
      { type: 'mood', value: 8 },
    ],
    category: 'staple-food',
  },
  {
    id: 'instant_noodles',
    name: '泡面',
    describe: '速食油炸面条，长期食用不利健康',
    maxStack: 2,
    stackable: true,
    effects: [
      { type: 'satiety', value: 35 },
      { type: 'health', value: -3 },
    ],
    category: 'staple-food',
  },
  {
    id: 'steamed_bun',
    name: '馒头',
    describe: '中国传统面食，朴实饱腹',
    maxStack: 5,
    stackable: true,
    effects: [
      { type: 'satiety', value: 20 },
      { type: 'energy', value: 10 },
    ],
    category: 'staple-food',
  },
]
