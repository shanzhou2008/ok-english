export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate: string | null;
}

export const badges: Badge[] = [
  {
    id: 'first-learn',
    name: '初次学习',
    description: '完成第一次学习',
    icon: '🌟',
    earned: true,
    earnedDate: '2026-07-01',
  },
  {
    id: 'song-fan',
    name: '儿歌达人',
    description: '听满5首儿歌',
    icon: '🎵',
    earned: true,
    earnedDate: '2026-07-03',
  },
  {
    id: 'game-master',
    name: '游戏高手',
    description: '完成10个游戏关卡',
    icon: '🎮',
    earned: false,
    earnedDate: null,
  },
  {
    id: 'speak-english',
    name: '开口说英语',
    description: '完成第一次口语练习',
    icon: '🗣️',
    earned: false,
    earnedDate: null,
  },
  {
    id: 'streak-3',
    name: '连续3天',
    description: '连续3天坚持学习',
    icon: '🔥',
    earned: false,
    earnedDate: null,
  },
  {
    id: 'streak-7',
    name: '连续7天',
    description: '连续7天坚持学习',
    icon: '💪',
    earned: false,
    earnedDate: null,
  },
  {
    id: 'vocab-master',
    name: '词汇小达人',
    description: '学会20个英语单词',
    icon: '📚',
    earned: false,
    earnedDate: null,
  },
  {
    id: 'puzzle-master',
    name: '拼图大师',
    description: '完成所有拼图关卡',
    icon: '🧩',
    earned: false,
    earnedDate: null,
  },
  {
    id: 'color-artist',
    name: '涂色艺术家',
    description: '完成所有涂色关卡',
    icon: '🎨',
    earned: false,
    earnedDate: null,
  },
  {
    id: 'learning-star',
    name: '学习之星',
    description: '累计学习时间达到60分钟',
    icon: '⭐',
    earned: false,
    earnedDate: null,
  },
];
