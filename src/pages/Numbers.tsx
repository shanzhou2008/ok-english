import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Volume2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { speakWord } from '@/lib/sound';

const numbers = [
  { num: 1, word: 'One', emoji: '🍎', color: '#FF6B6B' },
  { num: 2, word: 'Two', emoji: '🍐', color: '#3B82F6' },
  { num: 3, word: 'Three', emoji: '🍊', color: '#F59E0B' },
  { num: 4, word: 'Four', emoji: '🍋', color: '#10B981' },
  { num: 5, word: 'Five', emoji: '🍇', color: '#8B5CF6' },
  { num: 6, word: 'Six', emoji: '🍓', color: '#EC4899' },
  { num: 7, word: 'Seven', emoji: '🍑', color: '#F97316' },
  { num: 8, word: 'Eight', emoji: '🍒', color: '#EF4444' },
  { num: 9, word: 'Nine', emoji: '🥝', color: '#22C55E' },
  { num: 10, word: 'Ten', emoji: '🍉', color: '#06B6D4' },
  { num: 11, word: 'Eleven', emoji: '⭐', color: '#FBBF24' },
  { num: 12, word: 'Twelve', emoji: '🌟', color: '#F59E0B' },
  { num: 13, word: 'Thirteen', emoji: '✨', color: '#8B5CF6' },
  { num: 14, word: 'Fourteen', emoji: '💫', color: '#EC4899' },
  { num: 15, word: 'Fifteen', emoji: '🎵', color: '#06B6D4' },
  { num: 16, word: 'Sixteen', emoji: '🎈', color: '#3B82F6' },
  { num: 17, word: 'Seventeen', emoji: '🎁', color: '#F97316' },
  { num: 18, word: 'Eighteen', emoji: '🎀', color: '#EC4899' },
  { num: 19, word: 'Nineteen', emoji: '🎊', color: '#10B981' },
  { num: 20, word: 'Twenty', emoji: '🎉', color: '#7C5CFC' },
];

const COUNT_OPTIONS = [
  { label: '1-5', count: 5 },
  { label: '1-10', count: 10 },
  { label: '1-15', count: 15 },
  { label: '1-20', count: 20 },
];

export default function Numbers() {
  const navigate = useNavigate();
  const [activeNum, setActiveNum] = useState<number | null>(null);
  const [countTo, setCountTo] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCardClick = (num: number, word: string) => {
    setActiveNum(num);
    speakWord(word);
  };

  const handleCount = () => {
    setIsPlaying(true);
    const items = numbers.slice(0, countTo);
    items.forEach((item, i) => {
      setTimeout(() => {
        speakWord(item.word);
        setActiveNum(item.num);
        if (i === items.length - 1) {
          setTimeout(() => {
            setIsPlaying(false);
            setActiveNum(null);
          }, 1500);
        }
      }, i * 1500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-[#FCE7F3]">
      <header className="flex items-center px-4 py-3 bg-white/80 backdrop-blur-sm">
        <button onClick={() => navigate('/')} className="p-1">
          <ChevronLeft size={24} className="text-[#1A1A2E]" />
        </button>
        <h1 className="flex-1 text-center text-xl font-extrabold text-[#1A1A2E]">
          🔢 数字学习
        </h1>
        <div className="w-8" />
      </header>

      <div className="p-4">
        <div className="mb-4 text-center">
          <p className="text-[#6B7280] text-sm">点击数字听发音</p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {numbers.map((item) => (
            <motion.button
              key={item.num}
              onClick={() => handleCardClick(item.num, item.word)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-white shadow-lg transition-all ${
                activeNum === item.num ? 'ring-4 ring-[#7C5CFC] scale-105' : ''
              }`}
            >
              <motion.span
                className="text-3xl font-black"
                style={{ color: item.color }}
                animate={activeNum === item.num ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {item.num}
              </motion.span>
              <span className="text-xl mt-1">{item.emoji}</span>
              <span className="text-xs font-bold text-[#6B7280] mt-1">
                {item.word}
              </span>
            </motion.button>
          ))}
        </div>

        <motion.div
          className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-[#7C5CFC] to-[#FF6B9D] text-white text-center shadow-xl"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="text-sm opacity-90">试试数数！</p>
          <p className="text-2xl font-black mt-2">1, 2, 3...</p>
          
          <div className="mt-4 flex justify-center gap-2">
            {COUNT_OPTIONS.map((opt) => (
              <motion.button
                key={opt.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCountTo(opt.count)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                  countTo === opt.count
                    ? 'bg-white text-[#7C5CFC]'
                    : 'bg-white/20 text-white'
                }`}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
          
          <button
            onClick={handleCount}
            disabled={isPlaying}
            className="mt-4 px-6 py-2 rounded-full bg-white/20 font-bold flex items-center justify-center mx-auto gap-2 disabled:opacity-50"
          >
            <Volume2 size={20} />
            {isPlaying ? '播放中...' : `播放1-${countTo}`}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
