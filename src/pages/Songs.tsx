import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Heart } from 'lucide-react';
import PageLayout from '@/components/Layout/PageLayout';
import { songs, songCategories } from '@/data/songs';
import { useSongStore } from '@/stores/useSongStore';

const CATEGORIES = ['全部', '收藏', ...songCategories.map((c) => c.key)];

const formatDuration = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export default function Songs() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const { favorites, toggleFavorite, isFavorite } = useSongStore();

  const filtered =
    activeCategory === '全部'
      ? songs
      : activeCategory === '收藏'
      ? songs.filter((s) => favorites.includes(s.id))
      : songs.filter((s) => s.category === activeCategory);

  return (
    <PageLayout showTabBar title="儿歌">
      <div className="px-4 pb-6 pt-4">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                  active
                    ? 'bg-[#7C5CFC] text-white shadow-card'
                    : 'border border-gray-200 bg-white text-[#6B7280]'
                }`}
              >
                {cat === '收藏' ? '❤️ 收藏' : cat}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((song, i) => {
            const isFav = isFavorite(song.id);
            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35, ease: 'easeOut' }}
                whileTap={{ scale: 0.98 }}
                className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3 shadow-card"
              >
                <div
                  className="h-14 w-14 shrink-0 rounded-xl flex items-center justify-center text-3xl"
                  style={{ background: `linear-gradient(135deg, ${song.color}33, ${song.color}66)` }}
                >
                  {song.emoji}
                </div>
                <div className="min-w-0 flex-1" onClick={() => navigate(`/songs/${song.id}`)}>
                  <p className="truncate font-bold text-[#1A1A2E]">{song.title}</p>
                  <p className="truncate text-sm text-[#6B7280]">{song.titleCn}</p>
                  <span className="mt-1 inline-block rounded-full bg-[#7C5CFC]/10 px-2 py-0.5 text-xs font-semibold text-[#7C5CFC]">
                    {song.category}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1.5">
                  <span className="flex items-center gap-0.5 text-xs text-[#6B7280]">
                    <Clock size={12} /> {formatDuration(song.duration)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(song.id);
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                        isFav
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Heart size={18} className={isFav ? 'fill-current' : ''} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/songs/${song.id}`);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C5CFC]"
                    >
                      <Play size={16} className="ml-0.5 fill-white text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
