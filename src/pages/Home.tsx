import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Gamepad2, Mic, Rabbit } from 'lucide-react';
import PageLayout from '@/components/Layout/PageLayout';
import BunnyMascot from '@/components/Bunny/BunnyMascot';
import BunnySpeech from '@/components/Bunny/BunnySpeech';
import RingProgress from '@/components/ProgressBar/RingProgress';
import { useChildStore } from '@/stores/useChildStore';
import { useLearningStore } from '@/stores/useLearningStore';

/* ─── helpers ─── */
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

const RECOMMENDATIONS = [
  { title: 'ABC Song', subtitle: '经典字母歌', emoji: '🎵', gradient: 'from-[#7C5CFC] to-[#FF6B9D]', to: '/songs' },
  { title: '字母消消乐', subtitle: '趣味配对游戏', emoji: '🎮', gradient: 'from-[#00C9A7] to-[#4D9DE0]', to: '/games' },
  { title: '跟我读 Hello', subtitle: '口语练习', emoji: '🎤', gradient: 'from-[#FF6B9D] to-[#FFA94D]', to: '/speaking' },
];

/* ─── staggered section wrapper ─── */
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

/* ─── sections ─── */

function GreetingSection({ nickname }: { nickname: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white bg-gradient-to-r from-[#7C5CFC]/5 to-[#FF6B9D]/5 px-5 py-6 shadow-card">
      <BunnyMascot size="md" mood="happy" />
      <BunnySpeech text={`${getGreeting()}，${nickname}！`} position="right" />
    </div>
  );
}

function RecommendSection() {
  const navigate = useNavigate();
  return (
    <section>
      <h2 className="mb-3 text-lg font-extrabold text-[#1A1A2E]">今日推荐</h2>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        {RECOMMENDATIONS.map((item) => (
          <motion.div
            key={item.title}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(item.to)}
            className="min-w-[150px] cursor-pointer overflow-hidden rounded-2xl bg-white shadow-card"
          >
            <div className={`flex h-20 items-center justify-center bg-gradient-to-br ${item.gradient}`}>
              <span className="text-3xl">{item.emoji}</span>
            </div>
            <div className="p-3">
              <p className="text-sm font-bold text-[#1A1A2E]">{item.title}</p>
              <p className="mt-0.5 text-xs text-[#6B7280]">{item.subtitle}</p>
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
      <h2 className="mb-3 text-lg font-extrabold text-[#1A1A2E]">快速入口</h2>
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ENTRIES.map((entry) => {
          const Icon = entry.icon;
          return (
            <motion.button
              key={entry.to}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate(entry.to)}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full shadow-card"
                style={{ backgroundColor: entry.bg }}
              >
                <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-xs font-semibold text-[#1A1A2E]">{entry.label}</span>
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
    <section className="rounded-2xl bg-white p-5 shadow-card">
      <h2 className="mb-1 text-center text-lg font-extrabold text-[#1A1A2E]">今日学习</h2>
      <div className="flex flex-col items-center gap-2">
        <RingProgress percentage={pct} size={130} strokeWidth={10} />
        <p className="text-sm text-[#6B7280]">
          已学习 <span className="font-bold text-[#7C5CFC]">{todayMinutes}</span> 分钟 / 目标 {todayGoal} 分钟
        </p>
        <div className="mt-1 flex gap-5 text-sm font-semibold text-[#1A1A2E]">
          <span>🎵 × {completedSongs.length}</span>
          <span>🎮 × {completedGames.length}</span>
        </div>
      </div>
    </section>
  );
}

function AgeGroupSelector() {
  const { currentChild, setAgeGroup } = useChildStore();
  const current = currentChild?.ageGroup ?? 2;
  return (
    <section>
      <h2 className="mb-3 text-lg font-extrabold text-[#1A1A2E]">年龄切换</h2>
      <div className="flex justify-center gap-3">
        {AGE_OPTIONS.map((opt) => {
          const active = current === opt.value;
          return (
            <motion.button
              key={opt.value}
              whileTap={{ scale: 0.93 }}
              onClick={() => setAgeGroup(opt.value)}
              className={`min-w-[80px] rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                active
                  ? 'bg-[#7C5CFC] text-white shadow-card'
                  : 'border border-gray-200 bg-white text-[#6B7280]'
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

/* ─── page ─── */
export default function Home() {
  const { currentChild } = useChildStore();
  return (
    <PageLayout showTabBar title="OK英语">
      <div className="flex flex-col gap-6 px-4 pb-6 pt-4">
        <Section i={0}><GreetingSection nickname={currentChild?.nickname ?? '小朋友'} /></Section>
        <Section i={1}><RecommendSection /></Section>
        <Section i={2}><QuickEntryGrid /></Section>
        <Section i={3}><ProgressSection /></Section>
        <Section i={4}><AgeGroupSelector /></Section>
      </div>
    </PageLayout>
  );
}
