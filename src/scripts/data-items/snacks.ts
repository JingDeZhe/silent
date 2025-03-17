export const snacks: ItemPrototype[] = [
  {
    id: 'chocolate_bar',
    name: '巧克力棒',
    describe: '黑巧克力制品，缓解低血糖',
    icon: 'i-game-icons:chocolate-bar',
    maxStack: 5,
    stackable: true,
    effects: [
      { type: 'satiety', value: 5 },
      { type: 'mood', value: 15 },
      { type: 'energy', value: 10 },
    ],
    category: 'snack',
  },
  {
    id: 'potato_chips',
    name: '薯片',
    describe: '高盐高脂的膨化食品',
    maxStack: 3,
    stackable: true,
    effects: [
      { type: 'satiety', value: 8 },
      { type: 'mood', value: 12 },
      { type: 'health', value: -2 },
    ],
    category: 'snack',
  },
  {
    id: 'energy_drink',
    name: '能量饮料',
    describe: '含咖啡因的功能性饮料',
    maxStack: 2,
    stackable: false,
    effects: [
      { type: 'energy', value: 20, duration: 300 }, // 持续5分钟
      { type: 'health', value: -1 },
    ],
    category: 'snack',
  },
  {
    id: 'biscuit',
    name: '苏打饼干',
    describe: '低糖咸味饼干，适合充饥',
    maxStack: 6,
    stackable: true,
    effects: [
      { type: 'satiety', value: 12 },
      { type: 'mood', value: 5 },
    ],
    category: 'snack',
  },
]
