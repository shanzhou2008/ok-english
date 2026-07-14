import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { speakWord } from '@/lib/sound';

const colors = [
  { name: 'Red', nameCn: '红色', emoji: '🍎', color: '#EF4444' },
  { name: 'Blue', nameCn: '蓝色', emoji: '💧', color: '#3B82F6' },
  { name: 'Yellow', nameCn: '黄色', emoji: '☀️', color: '#FBBF24' },
  { name: 'Green', nameCn: '绿色', emoji: '🌿', color: '#22C55E' },
  { name: 'Orange', nameCn: '橙色', emoji: '🍊', color: '#F97316' },
  { name: 'Purple', nameCn: '紫色', emoji: '🍇', color: '#8B5CF6' },
  { name: 'Pink', nameCn: '粉色', emoji: '🌸', color: '#EC4899' },
  { name: 'Brown', nameCn: '棕色', emoji: '🍫', color: '#92400E' },
  { name: 'Black', nameCn: '黑色', emoji: '🐈‍⬛', color: '#1F2937' },
  { name: 'White', nameCn: '白色', emoji: '☁️', color: '#F9FAFB' },
];

const shapes = [
  { name: 'Circle', nameCn: '圆形', emoji: '🔴', color: '#EF4444' },
  { name: 'Square', nameCn: '正方形', emoji: '🟦', color: '#3B82F6' },
  { name: 'Triangle', nameCn: '三角形', emoji: '🔺', color: '#FBBF24' },
  { name: 'Rectangle', nameCn: '长方形', emoji: '⬜', color: '#6B7280' },
  { name: 'Star', nameCn: '星形', emoji: '⭐', color: '#F59E0B' },
  { name: 'Heart', nameCn: '心形', emoji: '❤️', color: '#EF4444' },
  { name: 'Diamond', nameCn: '菱形', emoji: '💎', color: '#8B5CF6' },
  { name: 'Oval', nameCn: '椭圆形', emoji: '🥚', color: '#FBBF24' },
];

export default function ColorsShapes() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'colors' | 'shapes'>('colors');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const items = tab === 'colors' ? colors : shapes;

  const handleItemClick = (index: number) => {
    setSelectedItem(index);
    speakWord(items[index].name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-[#F0FDF4]">
      <header className="flex items-center px-4 py-3 bg-white/80 backdrop-blur-sm">
        <button onClick={() => navigate('/')} className="p-1">
          <ChevronLeft size={24} className="text-[#1A1A2E]" />
        </button>
        <h1 className="flex-1 text-center text-xl font-extrabold text-[#1A1A2E]">
          🎨 颜色形状
        </h1>
        <div className="w-8" />
      </header>

      <div className="flex px-4 pt-2">
        <button
          onClick={() => { setTab('colors'); setSelectedItem(null); }}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            tab === 'colors'
              ? 'bg-[#7C5CFC] text-white'
              : 'bg-white/50 text-[#6B7280]'
          }`}
        >
          🎨 颜色
        </button>
        <button
          onClick={() => { setTab('shapes'); setSelectedItem(null); }}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            tab === 'shapes'
              ? 'bg-[#FF6B9D] text-white'
              : 'bg-white/50 text-[#6B7280]'
          }`}
        >
          📐 形状
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {items.map((item, index) => (
            <motion.button
              key={item.name}
              onClick={() => handleItemClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg transition-all ${
                tab === 'shapes' && item.name === 'Square'
                  ? 'bg-white'
                  : ''
              }`}
              style={{
                backgroundColor: tab === 'shapes' && item.name === 'Square' ? undefined : item.color,
                border: selectedItem === index ? '4px solid white' : 'none',
              }}
            >
              <span className="text-4xl">{item.emoji}</span>
              <span className="text-sm font-bold mt-2" style={{
                color: item.color === '#F9FAFB' ? '#1A1A2E' : 'white'
              }}>
                {item.name}
              </span>
              <span className="text-xs opacity-80" style={{
                color: item.color === '#F9FAFB' ? '#6B7280' : 'white'
              }}>
                {item.nameCn}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {selectedItem !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-4 right-4 p-4 rounded-2xl bg-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{items[selectedItem].emoji}</span>
              <div>
                <p className="text-xl font-bold text-[#1A1A2E]">
                  {items[selectedItem].name}
                </p>
                <p className="text-sm text-[#6B7280]">{items[selectedItem].nameCn}</p>
              </div>
            </div>
            <button
              onClick={() => speakWord(items[selectedItem].name)}
              className="p-3 rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#FF6B9D] text-white"
            >
              <Volume2 size={24} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
