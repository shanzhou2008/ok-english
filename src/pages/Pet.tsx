import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Award, Sparkles, Settings, Lock } from 'lucide-react';
import PageLayout from '@/components/Layout/PageLayout';
import BunnyMascot from '@/components/Bunny/BunnyMascot';
import BunnySpeech from '@/components/Bunny/BunnySpeech';
import { usePetStore } from '@/stores/usePetStore';
import { badges } from '@/data/badges';

const phrases = ['一起学习吧!', '你真棒!', '今天学什么呢?'];
const shopItems = [
  { emoji: '🎀', name: '可爱蝴蝶结', cost: 10 },
  { emoji: '🏠', name: '温馨小屋', cost: 20 },
  { emoji: '🌈', name: '彩虹桥', cost: 30 },
];

// Floating sparkle particle
function Sparkle({ delay, left }: { delay: number; left: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left, bottom: 80, fontSize: 14, color: '#FFD700' }}
      initial={{ opacity: 0, y: 0, x: 0 }}
      animate={{ opacity: [0, 1, 0], y: -130, x: [0, 8, -4, 6] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeOut' }}
    >
      ✦
    </motion.div>
  );
}

export default function Pet() {
  const navigate = useNavigate();
  const { level, exp, expToNext, stars, badges: earnedIds } = usePetStore();
  const [bunnyMood, setBunnyMood] = useState<'happy' | 'excited'>('happy');
  const [phrase, setPhrase] = useState(phrases[0]);
  const [phraseKey, setPhraseKey] = useState(0);

  // Cycle phrases
  useEffect(() => {
    const id = setInterval(() => {
      setPhrase((p) => phrases[(phrases.indexOf(p) + 1) % phrases.length]);
      setPhraseKey((k) => k + 1);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const handleBunnyTap = () => {
    setBunnyMood('excited');
    setTimeout(() => setBunnyMood('happy'), 1200);
  };

  const isEarned = (id: string) => earnedIds.includes(id);
  const expPct = Math.min((exp / expToNext) * 100, 100);

  return (
    <PageLayout title="宠物岛">
      {/* ── Pet Display ── */}
      <div className="mx-4 mt-2 rounded-3xl overflow-hidden relative" style={{ height: 288 }}>
        {/* Sky gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #C3D9FF 0%, #E8F0FF 45%, #B8F2D8 70%, #7ED957 100%)' }}
        />

        {/* Sun */}
        <motion.div
          className="absolute w-14 h-14 rounded-full"
          style={{
            top: 20,
            right: 28,
            background: 'radial-gradient(circle, #FFE066 40%, #FFD700 100%)',
            boxShadow: '0 0 28px rgba(255,215,0,0.6)',
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Clouds */}
        {[
          { top: 30, left: 16, w: 60 },
          { top: 14, left: 130, w: 50 },
        ].map((c, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ top: c.top, left: c.left, width: c.w, height: c.w * 0.45, background: 'rgba(255,255,255,0.95)' }}
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Flowers on grass */}
        {[
          { x: 24, color: '#FF6B9D' },
          { x: 90, color: '#FFA94D' },
          { x: 180, color: '#7C5CFC' },
          { x: 250, color: '#FF6B9D' },
          { x: 320, color: '#00C9A7' },
        ].map((f, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ bottom: 14, left: f.x, width: 12, height: 12, background: f.color }}
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
          />
        ))}

        {/* Sparkles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Sparkle key={i} delay={i * 0.6} left={40 + i * 50} />
        ))}

        {/* Bunny */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 cursor-pointer" onClick={handleBunnyTap}>
          <motion.div animate={bunnyMood === 'excited' ? { y: [0, -16, 0, -10, 0] } : {}} transition={{ duration: 0.5 }}>
            <BunnyMascot size="lg" mood={bunnyMood} />
          </motion.div>
        </div>

        {/* Speech bubble */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}>
              <BunnySpeech text={phrase} position="top" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <motion.div
        className="mx-4 mt-4 bg-white rounded-2xl shadow-card p-4 flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        {/* Level */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ background: '#7C5CFC' }}
        >
          Lv.{level}
        </div>
        {/* Exp bar */}
        <div className="flex-1">
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#F0F4FF' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7C5CFC, #FF6B9D)' }}
              initial={{ width: 0 }}
              animate={{ width: `${expPct}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </div>
          <p className="text-[10px] mt-1 text-center" style={{ color: '#6B7280' }}>
            {exp}/{expToNext} EXP
          </p>
        </div>
        {/* Stars */}
        <div className="flex-shrink-0 flex items-center gap-1 text-sm font-bold" style={{ color: '#1A1A2E' }}>
          <Star size={16} fill="#FFD700" stroke="#FFD700" />
          {stars}
        </div>
      </motion.div>

      {/* ── Badge Wall ── */}
      <div className="mx-4 mt-6">
        <h2 className="flex items-center gap-2 text-base font-bold mb-3" style={{ color: '#1A1A2E' }}>
          <Award size={18} style={{ color: '#7C5CFC' }} /> 我的徽章
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b, i) => {
            const earned = isEarned(b.id);
            return (
              <motion.div
                key={b.id}
                className="rounded-xl p-3 text-center relative"
                style={earned ? { background: '#FFFFFF', boxShadow: '0 2px 16px rgba(124,92,252,0.08)' } : { background: '#E5E7EB' }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}>
                <div className={earned ? '' : 'opacity-50'}>
                  <div className="text-3xl">{b.icon}</div>
                  <p className="text-xs mt-1 font-semibold" style={{ color: '#1A1A2E' }}>
                    {earned ? b.name : '???'}
                  </p>
                  {earned && b.earnedDate && (
                    <p className="text-[10px]" style={{ color: '#6B7280' }}>{b.earnedDate}</p>
                  )}
                </div>
                {!earned && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={18} style={{ color: '#6B7280' }} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Star Shop ── */}
      <div className="mx-4 mt-6">
        <h2 className="flex items-center gap-2 text-base font-bold mb-3" style={{ color: '#1A1A2E' }}>
          <Sparkles size={18} style={{ color: '#FF6B9D' }} /> 星星兑换
        </h2>
        <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
          当前 <span className="font-bold" style={{ color: '#FFA94D' }}>{stars}</span> ⭐
        </p>
        <div className="grid grid-cols-3 gap-3">
          {shopItems.map((item) => {
            const locked = stars < item.cost;
            return (
              <motion.div
                key={item.name}
                className={`rounded-xl p-3 text-center bg-white shadow-card ${locked ? 'opacity-50' : ''}`}
                whileTap={!locked ? { scale: 0.95 } : {}}>
                <div className="text-3xl">{item.emoji}</div>
                <p className="text-xs mt-1 font-semibold" style={{ color: '#1A1A2E' }}>{item.name}</p>
                <p className="text-xs font-bold" style={{ color: '#FFA94D' }}>{item.cost}⭐</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Parent Entry ── */}
      <div className="mx-4 mt-8 mb-4">
        <button
          onClick={() => navigate('/parent')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
          style={{ color: '#6B7280', background: '#E5E7EB' }}>
          <Settings size={16} /> 家长中心
        </button>
      </div>
    </PageLayout>
  );
}
