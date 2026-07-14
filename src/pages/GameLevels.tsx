import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock } from 'lucide-react';
import PageLayout from '@/components/Layout/PageLayout';
import BunnyMascot from '@/components/Bunny/BunnyMascot';
import StarRating from '@/components/StarRating/StarRating';
import { games, gameTypes } from '@/data/games';
import type { GameType } from '@/data/games';
import { useLearningStore } from '@/stores/useLearningStore';

const TYPE_COLORS: Record<GameType, string> = {
  pick: '#7C5CFC',
  puzzle: '#00C9A7',
  match: '#FF6B9D',
};

const NODE_CENTERS = [
  { x: 110, y: 32 },
  { x: 215, y: 94 },
  { x: 70, y: 156 },
  { x: 205, y: 218 },
  { x: 100, y: 280 },
];

export default function GameLevels() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const gameType = type as GameType;
  const completedGames = useLearningStore((s) => s.completedGames);
  const gameStars = useLearningStore((s) => s.gameStars);

  const typeInfo = gameTypes.find((g) => g.type === gameType);
  const levels = games.filter((g) => g.type === gameType);
  const color = TYPE_COLORS[gameType];

  const getUnlockedStatus = (levelIndex: number) => {
    if (levelIndex === 0) return true;
    const prevLevel = levels[levelIndex - 1];
    return completedGames.includes(prevLevel.id);
  };

  if (!typeInfo) return null;

  return (
    <PageLayout showTabBar={false}>
      <div className="min-h-screen" style={{ backgroundColor: '#F0F4FF' }}>
        <header className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3 bg-[#F0F4FF]/90 backdrop-blur-sm">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/games')}
            className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center"
          >
            <ChevronLeft size={20} style={{ color: '#1A1A2E' }} />
          </motion.button>
          <h1 className="text-lg font-bold flex-1 text-center" style={{ color: '#1A1A2E' }}>
            {typeInfo.title}
          </h1>
          <div className="w-9" />
        </header>

        <div className="px-6 pt-2 pb-10 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-2 mb-2 ml-1">
            <BunnyMascot size="sm" mood="happy" />
            <span className="text-sm font-semibold" style={{ color: '#6B7280' }}>
              跟着小兔出发吧！
            </span>
          </div>

          <div className="relative mx-auto" style={{ width: 300, height: 350 }}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {levels.map((level, i) => {
                if (i === 0) return null;
                const from = NODE_CENTERS[i - 1];
                const to = NODE_CENTERS[i];
                const isUnlocked = getUnlockedStatus(i);
                return (
                  <motion.line
                    key={`line-${level.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.12, duration: 0.3 }}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isUnlocked ? color : '#E5E7EB'}
                    strokeWidth={3}
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {levels.map((level, i) => {
              const c = NODE_CENTERS[i];
              const isUnlocked = getUnlockedStatus(i);
              const stars = gameStars[level.id] ?? 0;
              return (
                <motion.div
                  key={level.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.12 + 0.15, type: 'spring', stiffness: 300 }}
                  className="absolute flex flex-col items-center"
                  style={{ left: c.x - 28, top: c.y - 28, zIndex: 1 }}
                  onClick={() => isUnlocked && navigate(`/games/${gameType}/${level.id}`)}
                >
                  <motion.div
                    whileTap={isUnlocked ? { scale: 0.9 } : undefined}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-card ${
                      isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                    style={{ backgroundColor: isUnlocked ? color : '#E5E7EB' }}
                  >
                    {isUnlocked ? (
                      <span className="text-white text-lg font-bold">{level.level}</span>
                    ) : (
                      <Lock size={20} className="text-white" />
                    )}
                  </motion.div>

                  {isUnlocked && stars > 0 && (
                    <div className="mt-1">
                      <StarRating count={stars} size={14} />
                    </div>
                  )}

                  <span
                    className="text-xs mt-0.5 text-center whitespace-nowrap font-semibold"
                    style={{ color: isUnlocked ? '#1A1A2E' : '#6B7280' }}
                  >
                    {level.titleCn}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
