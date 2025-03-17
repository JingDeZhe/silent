export const fruits: ItemPrototype[] = [
  {
    id: 'apple',
    name: '苹果',
    describe: '新鲜红富士苹果，富含膳食纤维',
    icon: 'i-game-icons:shiny-apple',
    maxStack: 8,
    stackable: true,
    effects: [
      { type: 'satiety', value: 15 },
      { type: 'mood', value: 3 },
    ],
    category: 'fruit',
  },
  {
    id: 'banana',
    name: '香蕉',
    describe: '热带水果，快速补充能量',
    icon: 'i-game-icons:banana-bunch',
    maxStack: 6,
    stackable: true,
    effects: [
      { type: 'satiety', value: 10 },
      { type: 'energy', value: 8 },
    ],
    category: 'fruit',
  },
  {
    id: 'orange',
    name: '橙子',
    describe: '富含维生素C的柑橘类水果',
    icon: 'i-game-icons:orange',
    maxStack: 5,
    stackable: true,
    effects: [
      { type: 'satiety', value: 12 },
      { type: 'health', value: 2 },
    ],
    category: 'fruit',
  },
  {
    id: 'grape',
    name: '葡萄',
    icon: 'i-game-icons:grapes',
    describe: '酸甜可口的紫色葡萄',
    maxStack: 20,
    stackable: true,
    effects: [
      { type: 'satiety', value: 3 },
      { type: 'mood', value: 5 },
    ],
    category: 'fruit',
  },
]
