import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, BarChart3, Clock, Eye, User, ChevronRight,
  TrendingUp, BookOpen, Gamepad2, Mic, Bell, Calendar,
} from 'lucide-react';
import PageLayout from '@/components/Layout/PageLayout';
import BunnyMascot from '@/components/Bunny/BunnyMascot';
import { useChildStore } from '@/stores/useChildStore';
import { useLearningStore } from '@/stores/useLearningStore';

const ageGroupLabels: Record<1 | 2 | 3, string> = { 1: '2-3岁', 2: '3-4岁', 3: '4-5岁' };
const timeLimits = [15, 20, 30, 45, 60];
const restIntervals = [15, 20, 25];

export default function Parent() {
  const { currentChild, setAgeGroup } = useChildStore();
  const { todayMinutes, completedSongs, completedGames, weeklyData, speakingScore } = useLearningStore();

  const [dailyLimit, setDailyLimit] = useState(30);
  const [eyeProtection, setEyeProtection] = useState(true);
  const [restInterval, setRestInterval] = useState(20);

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1);
  const weekTotal = weeklyData.reduce((s, d) => s + d.minutes, 0);
  const remaining = Math.max(dailyLimit - todayMinutes, 0);
  const usagePct = Math.min((todayMinutes / dailyLimit) * 100, 100);

  const stats = [
    { icon: TrendingUp, label: '本周学习', value: `${weekTotal}分` },
    { icon: BookOpen, label: '儿歌', value: `${completedSongs.length}首` },
    { icon: Gamepad2, label: '游戏', value: `${completedGames.length}个` },
    { icon: Mic, label: '跟读', value: `${speakingScore}分` },
  ];

  const settingsLinks = [
    { icon: Bell, label: '学习提醒设置' },
    { icon: Calendar, label: '内容偏好' },
    { icon: User, label: '关于OK英语' },
  ];

  return (
    <PageLayout showTabBar={false}>
      <div className="px-4 pt-6 pb-10 space-y-5 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield size={22} style={{ color: '#7C5CFC' }} />
              <h1 className="text-xl font-bold" style={{ color: '#1A1A2E' }}>家长中心</h1>
            </div>
            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>管理孩子的学习与安全</p>
          </div>
          <BunnyMascot size="sm" mood="happy" />
        </div>

        {/* Child Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl" style={{ background: '#F0F4FF' }}>
                {currentChild.avatar}
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#1A1A2E' }}>{currentChild.nickname}</p>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F0F4FF', color: '#7C5CFC' }}>
                  {ageGroupLabels[currentChild.ageGroup]}
                </span>
              </div>
            </div>
            <button className="text-sm font-medium px-3 py-1 rounded-lg" style={{ background: '#F0F4FF', color: '#7C5CFC' }}>
              编辑
            </button>
          </div>
          <div className="flex gap-2">
            {([1, 2, 3] as const).map((g) => (
              <button
                key={g}
                onClick={() => setAgeGroup(g)}
                className="flex-1 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={currentChild.ageGroup === g
                  ? { background: '#7C5CFC', color: '#FFFFFF' }
                  : { background: '#F0F4FF', color: '#6B7280' }}>
                {ageGroupLabels[g]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Learning Report */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl shadow-card p-4 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} style={{ color: '#7C5CFC' }} />
            <h2 className="font-semibold" style={{ color: '#1A1A2E' }}>学习报告</h2>
          </div>

          {/* Weekly bar chart */}
          <div className="flex items-end justify-between gap-1 h-32 px-1">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px]" style={{ color: '#6B7280' }}>{d.minutes}</span>
                <div className="w-full flex justify-center">
                  <motion.div
                    className="w-5 rounded-t-md"
                    style={{ background: 'linear-gradient(to top, #7C5CFC, #FF6B9D)' }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.minutes / maxMinutes) * 80}px` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                </div>
                <span className="text-[10px]" style={{ color: '#6B7280' }}>{d.day}</span>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {stats.map((s) => (
              <div key={s.label} className="space-y-1">
                <s.icon size={16} className="mx-auto" style={{ color: '#7C5CFC' }} />
                <p className="text-xs font-semibold" style={{ color: '#1A1A2E' }}>{s.value}</p>
                <p className="text-[10px]" style={{ color: '#6B7280' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Time Management */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={18} style={{ color: '#7C5CFC' }} />
            <h2 className="font-semibold" style={{ color: '#1A1A2E' }}>时长管控</h2>
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>每日学习上限</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {timeLimits.map((t) => (
              <button
                key={t}
                onClick={() => setDailyLimit(t)}
                className="min-w-[56px] py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={dailyLimit === t
                  ? { background: '#7C5CFC', color: '#FFFFFF' }
                  : { background: '#F0F4FF', color: '#6B7280' }}>
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#6B7280' }}>今日剩余</span>
              <span className="font-semibold" style={{ color: '#1A1A2E' }}>{remaining} 分钟</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F0F4FF' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #7C5CFC, #FF6B9D)' }}
                initial={{ width: 0 }}
                animate={{ width: `${usagePct}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Eye Protection */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={18} style={{ color: '#7C5CFC' }} />
              <h2 className="font-semibold" style={{ color: '#1A1A2E' }}>护眼设置</h2>
            </div>
            <button
              onClick={() => setEyeProtection(!eyeProtection)}
              className="w-11 h-6 rounded-full transition-colors relative"
              style={{ background: eyeProtection ? '#7C5CFC' : '#E5E7EB' }}>
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                animate={{ left: eyeProtection ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ position: 'absolute' }}
              />
            </button>
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>休息间隔</p>
          <div className="flex gap-2">
            {restIntervals.map((t) => (
              <button
                key={t}
                onClick={() => setRestInterval(t)}
                disabled={!eyeProtection}
                className="flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
                style={eyeProtection && restInterval === t
                  ? { background: '#7C5CFC', color: '#FFFFFF' }
                  : { background: '#F0F4FF', color: '#6B7280' }}>
                {t}分钟
              </button>
            ))}
          </div>
          {eyeProtection && (
            <p className="text-xs font-medium" style={{ color: '#00C9A7' }}>✓ 已开启护眼提醒</p>
          )}
        </motion.div>

        {/* Settings Links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-card overflow-hidden">
          {settingsLinks.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-4 py-3.5"
              style={i > 0 ? { borderTop: '1px solid #F0F4FF' } : {}}>
              <div className="flex items-center gap-3">
                <item.icon size={18} style={{ color: '#6B7280' }} />
                <span className="text-sm" style={{ color: '#1A1A2E' }}>{item.label}</span>
              </div>
              <ChevronRight size={16} style={{ color: '#6B7280' }} />
            </div>
          ))}
        </motion.div>
      </div>
    </PageLayout>
  );
}
