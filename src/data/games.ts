export type GameType = 'pick' | 'puzzle' | 'match';

export interface PickTarget {
  emoji: string;
  name: string;
  en: string;
}

export interface MatchPair {
  emoji: string;
  name: string;
  en: string;
}

export interface GameLevel {
  id: string;
  type: GameType;
  title: string;
  titleCn: string;
  level: number;
  unlocked: boolean;
  stars: number;
  thumbnail: string;
  pickTarget?: PickTarget;
  pickOptions?: PickTarget[];
  matchPairs?: MatchPair[];
}

export interface GameTypeInfo {
  type: GameType;
  title: string;
  titleCn: string;
  icon: string;
  color: string;
  description: string;
}

export const gameTypes: GameTypeInfo[] = [
  { type: 'pick', title: '点选游戏', titleCn: '听音选图', icon: 'pointer', color: '#7C5CFC', description: '听发音，选图片' },
  { type: 'puzzle', title: '拼图游戏', titleCn: '趣味拼图', icon: 'puzzle', color: '#00C9A7', description: '拼一拼，学单词' },
  { type: 'match', title: '配对游戏', titleCn: '记忆配对', icon: 'heart', color: '#FF6B9D', description: '找相同，练记忆' },
];

const imgBase = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=';

const allPickItems = [
  { emoji: '🐱', name: '小猫', en: 'Cat' },
  { emoji: '🐶', name: '小狗', en: 'Dog' },
  { emoji: '🍎', name: '苹果', en: 'Apple' },
  { emoji: '🐦', name: '小鸟', en: 'Bird' },
  { emoji: '🐟', name: '小鱼', en: 'Fish' },
  { emoji: '🌸', name: '小花', en: 'Flower' },
  { emoji: '🦋', name: '蝴蝶', en: 'Butterfly' },
  { emoji: '🐸', name: '青蛙', en: 'Frog' },
  { emoji: '🐘', name: '大象', en: 'Elephant' },
  { emoji: '🦁', name: '狮子', en: 'Lion' },
  { emoji: '⭐', name: '星星', en: 'Star' },
  { emoji: '🌳', name: '大树', en: 'Tree' },
  { emoji: '🏠', name: '房子', en: 'House' },
  { emoji: '🚤', name: '小船', en: 'Boat' },
  { emoji: '⚽', name: '皮球', en: 'Ball' },
  { emoji: '📖', name: '书本', en: 'Book' },
  { emoji: '🪑', name: '椅子', en: 'Chair' },
  { emoji: '🌙', name: '月亮', en: 'Moon' },
];

const getRandomOptions = (target: typeof allPickItems[0], count: number = 3) => {
  const others = allPickItems.filter((i) => i.en !== target.en);
  return [...others.sort(() => Math.random() - 0.5).slice(0, count), target].sort(() => Math.random() - 0.5);
};

export const games: GameLevel[] = [
  // === Pick Game: 8 levels ===
  {
    id: 'pick-cat',
    type: 'pick',
    title: 'Find the Cat',
    titleCn: '找到小猫',
    level: 1,
    unlocked: true,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20cat%20for%20kids%20game&image_size=square`,
    pickTarget: { emoji: '🐱', name: '小猫', en: 'Cat' },
    pickOptions: getRandomOptions({ emoji: '🐱', name: '小猫', en: 'Cat' }),
  },
  {
    id: 'pick-dog',
    type: 'pick',
    title: 'Find the Dog',
    titleCn: '找到小狗',
    level: 2,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20dog%20for%20kids%20game&image_size=square`,
    pickTarget: { emoji: '🐶', name: '小狗', en: 'Dog' },
    pickOptions: getRandomOptions({ emoji: '🐶', name: '小狗', en: 'Dog' }),
  },
  {
    id: 'pick-apple',
    type: 'pick',
    title: 'Find the Apple',
    titleCn: '找到苹果',
    level: 3,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20red%20apple%20for%20kids%20game&image_size=square`,
    pickTarget: { emoji: '🍎', name: '苹果', en: 'Apple' },
    pickOptions: getRandomOptions({ emoji: '🍎', name: '苹果', en: 'Apple' }),
  },
  {
    id: 'pick-bird',
    type: 'pick',
    title: 'Find the Bird',
    titleCn: '找到小鸟',
    level: 4,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20bird%20for%20kids%20game&image_size=square`,
    pickTarget: { emoji: '🐦', name: '小鸟', en: 'Bird' },
    pickOptions: getRandomOptions({ emoji: '🐦', name: '小鸟', en: 'Bird' }),
  },
  {
    id: 'pick-fish',
    type: 'pick',
    title: 'Find the Fish',
    titleCn: '找到小鱼',
    level: 5,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20fish%20for%20kids%20game&image_size=square`,
    pickTarget: { emoji: '🐟', name: '小鱼', en: 'Fish' },
    pickOptions: getRandomOptions({ emoji: '🐟', name: '小鱼', en: 'Fish' }),
  },
  {
    id: 'pick-flower',
    type: 'pick',
    title: 'Find the Flower',
    titleCn: '找到小花',
    level: 6,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20flower%20for%20kids%20game&image_size=square`,
    pickTarget: { emoji: '🌸', name: '小花', en: 'Flower' },
    pickOptions: getRandomOptions({ emoji: '🌸', name: '小花', en: 'Flower' }),
  },
  {
    id: 'pick-elephant',
    type: 'pick',
    title: 'Find the Elephant',
    titleCn: '找到大象',
    level: 7,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20elephant%20for%20kids%20game&image_size=square`,
    pickTarget: { emoji: '🐘', name: '大象', en: 'Elephant' },
    pickOptions: getRandomOptions({ emoji: '🐘', name: '大象', en: 'Elephant' }),
  },
  {
    id: 'pick-lion',
    type: 'pick',
    title: 'Find the Lion',
    titleCn: '找到狮子',
    level: 8,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20lion%20for%20kids%20game&image_size=square`,
    pickTarget: { emoji: '🦁', name: '狮子', en: 'Lion' },
    pickOptions: getRandomOptions({ emoji: '🦁', name: '狮子', en: 'Lion' }),
  },

  // === Puzzle Game: 6 levels ===
  {
    id: 'puzzle-animal',
    type: 'puzzle',
    title: 'Animal Puzzle',
    titleCn: '动物拼图',
    level: 1,
    unlocked: true,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20animal%20puzzle%20for%20kids&image_size=square`,
  },
  {
    id: 'puzzle-fruit',
    type: 'puzzle',
    title: 'Fruit Puzzle',
    titleCn: '水果拼图',
    level: 2,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20fruit%20puzzle%20for%20kids&image_size=square`,
  },
  {
    id: 'puzzle-vehicle',
    type: 'puzzle',
    title: 'Vehicle Puzzle',
    titleCn: '交通工具拼图',
    level: 3,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20vehicle%20puzzle%20for%20kids&image_size=square`,
  },
  {
    id: 'puzzle-food',
    type: 'puzzle',
    title: 'Food Puzzle',
    titleCn: '食物拼图',
    level: 4,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20food%20puzzle%20for%20kids&image_size=square`,
  },
  {
    id: 'puzzle-nature',
    type: 'puzzle',
    title: 'Nature Puzzle',
    titleCn: '自然拼图',
    level: 5,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20nature%20puzzle%20for%20kids&image_size=square`,
  },
  {
    id: 'puzzle-color',
    type: 'puzzle',
    title: 'Color Puzzle',
    titleCn: '颜色拼图',
    level: 6,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20color%20puzzle%20for%20kids&image_size=square`,
  },

  // === Match Game: 6 levels ===
  {
    id: 'match-animals',
    type: 'match',
    title: 'Match Animals',
    titleCn: '动物配对',
    level: 1,
    unlocked: true,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20animal%20memory%20match%20game%20for%20kids&image_size=square`,
    matchPairs: [
      { emoji: '🐱', name: '小猫', en: 'Cat' },
      { emoji: '🐶', name: '小狗', en: 'Dog' },
      { emoji: '🐰', name: '兔子', en: 'Rabbit' },
      { emoji: '🐻', name: '小熊', en: 'Bear' },
    ],
  },
  {
    id: 'match-fruits',
    type: 'match',
    title: 'Match Fruits',
    titleCn: '水果配对',
    level: 2,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20fruit%20memory%20match%20game%20for%20kids&image_size=square`,
    matchPairs: [
      { emoji: '🍎', name: '苹果', en: 'Apple' },
      { emoji: '🍊', name: '橙子', en: 'Orange' },
      { emoji: '🍇', name: '葡萄', en: 'Grape' },
      { emoji: '🍓', name: '草莓', en: 'Strawberry' },
    ],
  },
  {
    id: 'match-foods',
    type: 'match',
    title: 'Match Foods',
    titleCn: '食物配对',
    level: 3,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20food%20memory%20match%20game%20for%20kids&image_size=square`,
    matchPairs: [
      { emoji: '🍕', name: '披萨', en: 'Pizza' },
      { emoji: '🍔', name: '汉堡', en: 'Hamburger' },
      { emoji: '🍰', name: '蛋糕', en: 'Cake' },
      { emoji: '🍩', name: '甜甜圈', en: 'Donut' },
    ],
  },
  {
    id: 'match-nature',
    type: 'match',
    title: 'Match Nature',
    titleCn: '自然配对',
    level: 4,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20nature%20memory%20match%20game%20for%20kids&image_size=square`,
    matchPairs: [
      { emoji: '🌸', name: '花朵', en: 'Flower' },
      { emoji: '🌈', name: '彩虹', en: 'Rainbow' },
      { emoji: '☀️', name: '太阳', en: 'Sun' },
      { emoji: '🌙', name: '月亮', en: 'Moon' },
    ],
  },
  {
    id: 'match-vehicles',
    type: 'match',
    title: 'Match Vehicles',
    titleCn: '交通工具配对',
    level: 5,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20vehicle%20memory%20match%20game%20for%20kids&image_size=square`,
    matchPairs: [
      { emoji: '🚗', name: '小汽车', en: 'Car' },
      { emoji: '🚌', name: '公交车', en: 'Bus' },
      { emoji: '🚀', name: '火箭', en: 'Rocket' },
      { emoji: '✈️', name: '飞机', en: 'Plane' },
    ],
  },
  {
    id: 'match-things',
    type: 'match',
    title: 'Match Things',
    titleCn: '日常物品配对',
    level: 6,
    unlocked: false,
    stars: 0,
    thumbnail: `${imgBase}cute%20cartoon%20daily%20objects%20memory%20match%20game%20for%20kids&image_size=square`,
    matchPairs: [
      { emoji: '⚽', name: '皮球', en: 'Ball' },
      { emoji: '📖', name: '书本', en: 'Book' },
      { emoji: '🪑', name: '椅子', en: 'Chair' },
      { emoji: '🏠', name: '房子', en: 'House' },
    ],
  },
];
