import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Volume2, PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { speakWord } from '@/lib/sound';

const animals = [
  { name: 'Cat', nameCn: '猫', emoji: '🐱', sound: 'Meow', color: '#F59E0B' },
  { name: 'Dog', nameCn: '狗', emoji: '🐶', sound: 'Woof', color: '#92400E' },
  { name: 'Bird', nameCn: '鸟', emoji: '🐦', sound: 'Tweet', color: '#3B82F6' },
  { name: 'Fish', nameCn: '鱼', emoji: '🐟', sound: 'Blub', color: '#06B6D4' },
  { name: 'Rabbit', nameCn: '兔子', emoji: '🐰', sound: 'Hop', color: '#F472B6' },
  { name: 'Bear', nameCn: '熊', emoji: '🐻', sound: 'Roar', color: '#92400E' },
  { name: 'Elephant', nameCn: '大象', emoji: '🐘', sound: 'Trumpet', color: '#6B7280' },
  { name: 'Lion', nameCn: '狮子', emoji: '🦁', sound: 'Roar', color: '#F59E0B' },
  { name: 'Monkey', nameCn: '猴子', emoji: '🐒', sound: 'Ooh', color: '#92400E' },
  { name: 'Panda', nameCn: '熊猫', emoji: '🐼', sound: 'Bamboo', color: '#1F2937' },
  { name: 'Tiger', nameCn: '老虎', emoji: '🐯', sound: 'Growl', color: '#F97316' },
  { name: 'Giraffe', nameCn: '长颈鹿', emoji: '🦒', sound: 'Munch', color: '#FBBF24' },
  { name: 'Zebra', nameCn: '斑马', emoji: '🦓', sound: 'Neigh', color: '#374151' },
  { name: 'Dolphin', nameCn: '海豚', emoji: '🐬', sound: 'Click', color: '#0EA5E9' },
  { name: 'Whale', nameCn: '鲸鱼', emoji: '🐋', sound: 'Song', color: '#0369A1' },
  { name: 'Butterfly', nameCn: '蝴蝶', emoji: '🦋', sound: 'Flutter', color: '#EC4899' },
  { name: 'Frog', nameCn: '青蛙', emoji: '🐸', sound: 'Ribbit', color: '#22C55E' },
  { name: 'Snake', nameCn: '蛇', emoji: '🐍', sound: 'Hiss', color: '#16A34A' },
];

export default function Animals() {
  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);

  const handleAnimalClick = (index: number) => {
    setSelectedAnimal(index);
    speakWord(animals[index].name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-[#E0F2FE]">
      <header className="flex items-center px-4 py-3 bg-white/80 backdrop-blur-sm">
        <button onClick={() => navigate('/')} className="p-1">
          <ChevronLeft size={24} className="text-[#1A1A2E]" />
        </button>
        <h1 className="flex-1 text-center text-xl font-extrabold text-[#1A1A2E]">
          🐾 动物世界
        </h1>
        <div className="w-8" />
      </header>

      <div className="p-4">
        <div className="mb-4 text-center">
          <p className="text-[#6B7280] text-sm">点击动物听发音和叫声</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {animals.map((animal, index) => (
            <motion.button
              key={animal.name}
              onClick={() => handleAnimalClick(index)}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95, rotate: -5 }}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white shadow-lg transition-all ${
                selectedAnimal === index ? 'ring-4 ring-[#22C55E]' : ''
              }`}
            >
              <motion.span
                animate={selectedAnimal === index ? { y: [-10, 10, -10] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-4xl"
              >
                {animal.emoji}
              </motion.span>
              <span className="text-sm font-bold mt-2" style={{ color: animal.color }}>
                {animal.name}
              </span>
              <span className="text-xs text-[#6B7280]">{animal.nameCn}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {selectedAnimal !== null && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 p-6 rounded-t-3xl bg-gradient-to-r from-[#22C55E] to-[#10B981] text-white shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl"
              >
                {animals[selectedAnimal].emoji}
              </motion.div>
              <div>
                <p className="text-2xl font-black">{animals[selectedAnimal].name}</p>
                <p className="text-sm opacity-90">{animals[selectedAnimal].nameCn}</p>
                <p className="text-xs opacity-70 mt-1">声音: {animals[selectedAnimal].sound}</p>
              </div>
            </div>
            <button
              onClick={() => speakWord(animals[selectedAnimal].name)}
              className="p-4 rounded-full bg-white/20"
            >
              <Volume2 size={28} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
