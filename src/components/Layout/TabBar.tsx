import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Music, Gamepad2, Mic, Rabbit } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { label: '首页', icon: Home, route: '/' },
  { label: '儿歌', icon: Music, route: '/songs' },
  { label: '游戏', icon: Gamepad2, route: '/games' },
  { label: '跟读', icon: Mic, route: '/speaking' },
  { label: '我的', icon: Rabbit, route: '/pet' },
];

const PRIMARY = '#7C5CFC';
const INACTIVE = '#6B7280';

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="glass fixed bottom-0 left-0 right-0 z-50 h-16 rounded-t-3xl border-t border-white/60"
      style={{ boxShadow: '0 -4px 20px rgba(124,92,252,0.08)' }}
    >
      <div className="flex h-full max-w-lg mx-auto items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.route;
          const Icon = tab.icon;
          const color = isActive ? PRIMARY : INACTIVE;

          return (
            <motion.button
              key={tab.route}
              onClick={() => navigate(tab.route)}
              className="relative flex h-full flex-1 flex-col items-center justify-center gap-1"
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <div
                className="relative flex items-center justify-center"
                style={{ width: 44, height: 32 }}
              >
                {isActive && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: 'rgba(124,92,252,0.12)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon
                  size={22}
                  className="relative transition-colors duration-200"
                  style={{ color }}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                className="text-[10px] font-bold leading-tight transition-colors duration-200"
                style={{ color }}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
