import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '@/components/Layout/PageLayout';
import { gameTypes, games } from '@/data/games';
import type { GameType } from '@/data/games';

const TYPE_COLORS: Record<GameType, string> = {
  pick: '#7C5CFC',
  puzzle: '#00C9A7',
  match: '#FF6B9D',
};

const TYPE_EMOJI: Record<GameType, string> = {
  pick: '👆',
  puzzle: '🧩',
  match: '💕',
};

const TYPE_SUBTITLE: Record<GameType, string> = {
  pick: 'Pick & Choose',
  puzzle: 'Fun Puzzle',
  match: 'Match Game',
};

export default function Games() {
  const navigate = useNavigate();

  return (
    <PageLayout title="互动游戏" showTabBar>
      <div className="px-4 pt-3 pb-6">
        <div className="flex flex-col gap-3.5">
          {gameTypes.map((gt, i) => {
            const count = games.filter((g) => g.type === gt.type).length;
            return (
              <motion.div
                key={gt.type}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12, type: 'spring', stiffness: 220, damping: 20 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/games/${gt.type}`)}
                className="bg-white rounded-2xl shadow-card h-28 flex overflow-hidden cursor-pointer"
              >
                {/* Left colored section with emoji */}
                <div
                  className="w-[100px] flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: TYPE_COLORS[gt.type] }}
                >
                  <span className="text-5xl drop-shadow-sm">{TYPE_EMOJI[gt.type]}</span>
                </div>

                {/* Right info section */}
                <div className="flex-1 flex flex-col justify-center px-4 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: '#1A1A2E' }}>
                      {gt.title}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: '#F0F4FF', color: TYPE_COLORS[gt.type] }}
                    >
                      {count}关
                    </span>
                  </div>
                  <span className="text-sm font-semibold mt-0.5" style={{ color: '#6B7280' }}>
                    {TYPE_SUBTITLE[gt.type]}
                  </span>
                  <span className="text-sm mt-1" style={{ color: '#6B7280' }}>
                    {gt.description}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
