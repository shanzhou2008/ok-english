import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Gamepad2, Mic, Rabbit, BookOpen, Hash, Palette, PawPrint } from 'lucide-react';
import PageLayout from '@/components/Layout/PageLayout';
import BunnyMascot from '@/components/Bunny/BunnyMascot';
import BunnySpeech from '@/components/Bunny/BunnySpeech';
import RingProgress from '@/components/ProgressBar/RingProgress';
import { useChildStore } from '@/stores/useChildStore';
import { useLearningStore } from '@/stores/useLearningStore';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return '早上好';
  if (h < 18) return '下午好';
  return '晚上好';
}

const AGE_OPTIONS: { label: string; value: 1 | 2 | 3 }[] = [
  { label: '2-3岁', value: 1 },
  { label: '3-4岁', value: 2 },
  { label: '4-5岁', value: 3 },
];

const QUICK_ENTRIES = [
  { label: '儿歌动画', icon: Music, bg: '#7C5CFC', to: '/songs' },
  { label: '互动游戏', icon: Gamepad2, bg: '#00C9A7', to: '/games' },
  { label: '口语跟读', icon: Mic, bg: '#FF6B9D', to: '/speaking' },
  { label: '宠物岛', icon: Rabbit, bg: '#FFA94D', to: '/pet' },
];

const LEARNING_ENTRIES = [
  { label: '字母学习', icon: BookOpen, bg: '#FF6B6B', to: '/alphabet' },
  { label: '数字学习', icon: Hash, bg: '#3B82F6', to: '/numbers' },
  { label: '颜色形状', icon: Palette, bg: '#FBBF24', to: '/colors-shapes' },
  { label: '动物世界', icon: PawPrint, bg: '#22C55E', to: '/animals' },
];

const RECOMMENDATIONS = [
  { title: 'ABC Song', subtitle: '经典字母歌', emoji: '🎵', gradient: 'from-[#7C5CFC] to-[#FF6B9D]', to: '/songs' },
  { title: '字母学习', subtitle: 'A-Z 趣味学习', emoji: '🔤', gradient: 'from-[#FF6B6B] to-[#F97316]', to: '/alphabet' },
  { title: '宠物岛', subtitle: '和小兔子一起玩', emoji: '🐰', gradient: 'from-[#FFA94D] to-[#FBBF24]', to: '/pet' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.45, ease: 'easeOut' },
  }),
};

function Section({ i, children }: { i: number; children: ReactNode }) {
  return (
    <motion.div custom={i} variants={sectionVariants} initial="hidden" animate="visible">
      {children}
    </motion.div>
  );
}

function GreetingSection({ nickname }: { nickname: string }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7C5CFC] to-[#FF6B9D] p-5 shadow-card-lg"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute -right-4 -top-4 text-6xl opacity-20"
        animate={{ y: [-10, 10], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🌈
      </motion.div>
      <motion.div
        className="absolute right-8 top-8 text-3xl opacity-30"
        animate={{ y: [-5, 5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        ✨
      </motion.div>
      <div className="relative flex items-center gap-4">
        <motion.div
          animate={{ y: [-5, 5], rotate: [-3, 3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <BunnyMascot size="md" mood="happy" />
        </motion.div>
        <div>
          <motion.p
            className="text-white/90 text-sm font-semibold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {getGreeting()}
          </motion.p>
          <motion.h1
            className="text-2xl font-black text-white"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {nickname} 小朋友 👋
          </motion.h1>
        </div>
      </div>
    </motion.div>
  );
}

function RecommendSection() {
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl emoji-wiggle">⭐</span>
        <h2 className="text-lg font-extrabold text-[#1A1A2E]">今日推荐</h2>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        {RECOMMENDATIONS.map((item, index) => (
          <motion.div
            key={item.title}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(item.to)}
            className="min-w-[160px] cursor-pointer overflow-hidden rounded-2xl bg-white card-shadow"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`relative flex h-24 items-center justify-center bg-gradient-to-br ${item.gradient}`}>
              <motion.span
                className="text-4xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {item.emoji}
              </motion.span>
              <motion.div
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white/30"
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-bold text-[#1A1A2E]">{item.title}</p>
              <p className="mt-1 text-xs text-[#6B7280]">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function QuickEntryGrid() {
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl emoji-bounce">🎮</span>
        <h2 className="text-lg font-extrabold text-[#1A1A2E]">快速入口</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ENTRIES.map((entry, index) => {
          const Icon = entry.icon;
          return (
            <motion.button
              key={entry.to}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(entry.to)}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.span
                className="flex h-16 w-16 items-center justify-center rounded-full card-shadow"
                style={{ backgroundColor: entry.bg }}
                whileHover={{ rotate: 10 }}
                whileTap={{ rotate: -10 }}
              >
                <Icon className="h-8 w-8 text-white" strokeWidth={2.5} />
              </motion.span>
              <span className="text-xs font-bold text-[#1A1A2E]">{entry.label}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function LearningGrid() {
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl emoji-float">📚</span>
        <h2 className="text-lg font-extrabold text-[#1A1A2E]">学习乐园</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {LEARNING_ENTRIES.map((entry, index) => {
          const Icon = entry.icon;
          return (
            <motion.button
              key={entry.to}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(entry.to)}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.span
                className="flex h-16 w-16 items-center justify-center rounded-full card-shadow"
                style={{ backgroundColor: entry.bg }}
                animate={{ boxShadow: [`0 4px 15px ${entry.bg}44`, `0 6px 20px ${entry.bg}66`, `0 4px 15px ${entry.bg}44`] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className="h-8 w-8 text-white" strokeWidth={2.5} />
              </motion.span>
              <span className="text-xs font-bold text-[#1A1A2E]">{entry.label}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function ProgressSection() {
  const { todayMinutes, todayGoal, completedSongs, completedGames } = useLearningStore();
  const pct = todayGoal > 0 ? Math.min(Math.round((todayMinutes / todayGoal) * 100), 100) : 0;
  return (
    <motion.section
      className="rounded-3xl bg-white p-6 card-shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-xl">🎯</span>
        <h2 className="text-lg font-extrabold text-[#1A1A2E]">今日学习</h2>
      </div>
      <div className="flex flex-col items-center gap-3">
        <RingProgress percentage={pct} size={140} strokeWidth={12} />
        <p className="text-sm text-[#6B7280]">
          已学习 <span className="font-black text-[#7C5CFC] text-lg">{todayMinutes}</span> 分钟
          <span className="mx-2">/</span>
          目标 <span className="font-bold text-[#FF6B9D]">{todayGoal}</span> 分钟
        </p>
        <div className="mt-2 flex gap-6">
          <motion.div
            className="flex flex-col items-center gap-1"
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-2xl emoji-bounce">🎵</span>
            <span className="text-sm font-bold text-[#7C5CFC]">{completedSongs.length}</span>
            <span className="text-xs text-[#6B7280]">首儿歌</span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center gap-1"
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-2xl emoji-wiggle">🎮</span>
            <span className="text-sm font-bold text-[#00C9A7]">{completedGames.length}</span>
            <span className="text-xs text-[#6B7280]">个游戏</span>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function AgeGroupSelector() {
  const { currentChild, setAgeGroup } = useChildStore();
  const current = currentChild?.ageGroup ?? 2;
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">👶</span>
        <h2 className="text-lg font-extrabold text-[#1A1A2E]">年龄切换</h2>
      </div>
      <div className="flex justify-center gap-3">
        {AGE_OPTIONS.map((opt) => {
          const active = current === opt.value;
          return (
            <motion.button
              key={opt.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAgeGroup(opt.value)}
              className={`min-w-[90px] rounded-full px-6 py-3 text-sm font-bold transition-all ${
                active
                  ? 'bg-gradient-to-r from-[#7C5CFC] to-[#FF6B9D] text-white card-shadow'
                  : 'border-2 border-gray-100 bg-white/80 text-[#6B7280]'
              }`}
            >
              {opt.label}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

export default function Home() {
  const { currentChild } = useChildStore();
  return (
    <PageLayout showTabBar title="OK英语">
      <div className="flex flex-col gap-5 px-4 pb-6 pt-4">
        <Section i={0}><GreetingSection nickname={currentChild?.nickname ?? '小朋友'} /></Section>
        <Section i={1}><RecommendSection /></Section>
        <Section i={2}><QuickEntryGrid /></Section>
        <Section i={3}><LearningGrid /></Section>
        <Section i={4}><ProgressSection /></Section>
        <Section i={5}><AgeGroupSelector /></Section>
      </div>
    </PageLayout>
  );
}
