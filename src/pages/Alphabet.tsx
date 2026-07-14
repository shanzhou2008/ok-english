import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Volume2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { speakWord } from '@/lib/sound';

const alphabet = [
  { letter: 'A', word: 'Apple', emoji: '🍎', color: '#FF6B6B' },
  { letter: 'B', word: 'Ball', emoji: '⚽', color: '#3B82F6' },
  { letter: 'C', word: 'Cat', emoji: '🐱', color: '#F59E0B' },
  { letter: 'D', word: 'Dog', emoji: '🐶', color: '#10B981' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', color: '#8B5CF6' },
  { letter: 'F', word: 'Fish', emoji: '🐟', color: '#06B6D4' },
  { letter: 'G', word: 'Giraffe', emoji: '🦒', color: '#FBBF24' },
  { letter: 'H', word: 'Horse', emoji: '🐴', color: '#92400E' },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦', color: '#F97316' },
  { letter: 'J', word: 'Jellyfish', emoji: '🎐', color: '#EC4899' },
  { letter: 'K', word: 'Koala', emoji: '🐨', color: '#6B7280' },
  { letter: 'L', word: 'Lion', emoji: '🦁', color: '#F59E0B' },
  { letter: 'M', word: 'Monkey', emoji: '🐒', color: '#92400E' },
  { letter: 'N', word: 'Nest', emoji: '🕊️', color: '#10B981' },
  { letter: 'O', word: 'Orange', emoji: '🍊', color: '#F97316' },
  { letter: 'P', word: 'Panda', emoji: '🐼', color: '#1F2937' },
  { letter: 'Q', word: 'Queen', emoji: '👸', color: '#8B5CF6' },
  { letter: 'R', word: 'Rabbit', emoji: '🐰', color: '#F472B6' },
  { letter: 'S', word: 'Sun', emoji: '☀️', color: '#FBBF24' },
  { letter: 'T', word: 'Tiger', emoji: '🐯', color: '#F97316' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️', color: '#3B82F6' },
  { letter: 'V', word: 'Van', emoji: '🚐', color: '#8B5CF6' },
  { letter: 'W', word: 'Whale', emoji: '🐋', color: '#0EA5E9' },
  { letter: 'X', word: 'X-ray', emoji: '📷', color: '#6366F1' },
  { letter: 'Y', word: 'Yellow', emoji: '🌻', color: '#FBBF24' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', color: '#1F2937' },
];

export default function Alphabet() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    const item = alphabet[index];
    speakWord(item.letter);
    setTimeout(() => speakWord(item.word), 500);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-[#E0F2FE]">
      <header className="flex items-center px-4 py-3 bg-white/80 backdrop-blur-sm">
        <button onClick={() => navigate('/')} className="p-1">
          <ChevronLeft size={24} className="text-[#1A1A2E]" />
        </button>
        <h1 className="flex-1 text-center text-xl font-extrabold text-[#1A1A2E]">
          🔤 字母学习
        </h1>
        <div className="w-8" />
      </header>

      <div className="p-4">
        <div className="mb-4 text-center">
          <p className="text-[#6B7280] text-sm">点击字母卡片听发音</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {alphabet.map((item, index) => (
            <motion.button
              key={item.letter}
              onClick={() => handleCardClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white shadow-lg"
              style={{ border: `3px solid ${item.color}` }}
            >
              <span className="text-4xl font-black" style={{ color: item.color }}>
                {item.letter}
              </span>
              <span className="text-3xl mt-2">{item.emoji}</span>
              <span className="text-xs font-bold text-[#6B7280] mt-1">
                {item.word}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-8 shadow-2xl text-center max-w-xs mx-4"
              style={{ border: `6px solid ${alphabet[selectedIndex].color}` }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                {alphabet[selectedIndex].emoji}
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-7xl font-black mb-2"
                style={{ color: alphabet[selectedIndex].color }}
              >
                {alphabet[selectedIndex].letter}
              </motion.div>
              <p className="text-2xl font-bold text-[#1A1A2E]">
                {alphabet[selectedIndex].word}
              </p>
              <button
                onClick={() => {
                  speakWord(alphabet[selectedIndex].letter);
                  setTimeout(() => speakWord(alphabet[selectedIndex].word), 500);
                }}
                className="mt-6 p-4 rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#FF6B9D] text-white"
              >
                <Volume2 size={32} />
              </button>
              <button
                onClick={() => {
                  const prev = selectedIndex > 0 ? selectedIndex - 1 : alphabet.length - 1;
                  setSelectedIndex(prev);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl"
              >
                ←
              </button>
              <button
                onClick={() => {
                  const next = selectedIndex < alphabet.length - 1 ? selectedIndex + 1 : 0;
                  setSelectedIndex(next);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl"
              >
                →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
