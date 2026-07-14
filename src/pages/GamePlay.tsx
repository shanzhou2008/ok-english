import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Volume2, Lightbulb, RefreshCw } from 'lucide-react';
import PageLayout from '@/components/Layout/PageLayout';
import BunnyMascot from '@/components/Bunny/BunnyMascot';
import StarRating from '@/components/StarRating/StarRating';
import { games } from '@/data/games';
import type { GameType } from '@/data/games';
import { useLearningStore } from '@/stores/useLearningStore';
import { usePetStore } from '@/stores/usePetStore';
import {
  unlockAudio,
  playClick,
  playCorrect,
  playWrong,
  playWin,
  playPop,
  speakWord,
} from '@/lib/sound';

function ResultOverlay({ stars, onContinue }: { stars: number; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl w-full max-w-xs"
      >
        <BunnyMascot size="md" mood="excited" />
        <span className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>太棒了！</span>
        <StarRating count={stars} size={36} />
        <span className="text-lg font-bold" style={{ color: '#7C5CFC' }}>获得 {stars} ⭐</span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClick();
            onContinue();
          }}
          className="mt-2 px-8 py-3 rounded-full text-white font-bold text-lg shadow-button"
          style={{ backgroundColor: '#7C5CFC' }}
        >
          继续
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function PickGame({
  onFinish,
  gameInfo,
}: {
  onFinish: (stars: number) => void;
  gameInfo: (typeof games)[0];
}) {
  const target = gameInfo.pickTarget || { emoji: '🐱', name: '小猫', en: 'Cat' };
  const options =
    gameInfo.pickOptions || [
      { emoji: '🐱', name: '小猫', en: 'Cat' },
      { emoji: '🐶', name: '小狗', en: 'Dog' },
      { emoji: '🍎', name: '苹果', en: 'Apple' },
      { emoji: '🐦', name: '小鸟', en: 'Bird' },
    ];
  const targetIdx = options.findIndex((o) => o.en === target.en);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [highlight, setHighlight] = useState(false);

  const speak = useCallback(() => {
    unlockAudio();
    setHighlight(true);
    window.setTimeout(() => setHighlight(false), 700);
    speakWord(target.en);
  }, [target.en]);

  const handlePick = (idx: number) => {
    if (feedback === 'correct') return;
    unlockAudio();
    playClick();
    const next = attempts + 1;
    setAttempts(next);
    setSelected(idx);
    if (idx === targetIdx) {
      setFeedback('correct');
      playCorrect();
      // 朗读正确单词
      window.setTimeout(() => speakWord(target.en), 300);
      const stars = next === 1 ? 3 : next === 2 ? 2 : 1;
      window.setTimeout(() => onFinish(stars), 1500);
    } else {
      setFeedback('wrong');
      playWrong();
      window.setTimeout(() => {
        setFeedback(null);
        setSelected(null);
      }, 600);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4">
      <motion.div
        animate={highlight ? { scale: [1, 1.06, 1] } : {}}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-card p-5 flex flex-col items-center gap-1"
      >
        <span className="text-2xl font-bold" style={{ color: '#7C5CFC' }}>
          Find the {target.en}!
        </span>
        <span className="text-base font-semibold" style={{ color: '#1A1A2E' }}>
          找到{target.name}
        </span>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {options.map((item, i) => {
          const showCorrect = feedback === 'correct' && i === targetIdx;
          const wrong = feedback === 'wrong' && selected === i;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePick(i)}
              animate={wrong ? { x: [0, -8, 8, -8, 8, 0] } : showCorrect ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 0.4 }}
              className="aspect-square rounded-2xl flex items-center justify-center shadow-card"
              style={{
                backgroundColor: showCorrect ? '#E6FBF4' : '#FFFFFF',
                border: showCorrect ? '3px solid #00C9A7' : '3px solid transparent',
              }}
            >
              <span className="text-6xl">{item.emoji}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="h-7">
        {feedback === 'wrong' && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold" style={{ color: '#FF6B9D' }}>
            再试一次～
          </motion.p>
        )}
        {feedback === 'correct' && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-bold" style={{ color: '#00C9A7' }}>
            太棒了！🎉
          </motion.p>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={speak}
        className="px-6 py-3 rounded-full text-white font-bold shadow-button flex items-center gap-2"
        style={{ backgroundColor: '#7C5CFC' }}
      >
        <Volume2 size={20} />
        播放发音
      </motion.button>
    </div>
  );
}

const puzzleColors = ['#7C5CFC', '#00C9A7', '#FF6B9D', '#FFA94D'];
const puzzleEmojis = ['🧸', '🌟', '🌈', '🎈'];

function PuzzleGame({ onFinish }: { onFinish: (stars: number) => void }) {
  const correct = [0, 1, 2, 3];
  const [pieces, setPieces] = useState<number[]>(() => {
    let arr: number[];
    do {
      arr = [...correct].sort(() => Math.random() - 0.5);
    } while (arr.every((p, i) => p === correct[i]));
    return arr;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [swaps, setSwaps] = useState(0);
  const [solved, setSolved] = useState(false);

  const tryFinish = (arr: number[], count: number) => {
    if (arr.every((p, i) => p === correct[i])) {
      setSolved(true);
      playWin();
      const stars = count <= 2 ? 3 : count <= 4 ? 2 : 1;
      window.setTimeout(() => onFinish(stars), 1200);
    }
  };

  const handleSwap = (idx: number) => {
    if (solved) return;
    unlockAudio();
    playClick();
    if (selected === null) {
      setSelected(idx);
      return;
    }
    if (selected === idx) {
      setSelected(null);
      return;
    }
    const next = [...pieces];
    [next[selected], next[idx]] = [next[idx], next[selected]];
    setPieces(next);
    setSelected(null);
    const count = swaps + 1;
    setSwaps(count);
    tryFinish(next, count);
  };

  const handleHint = () => {
    if (solved) return;
    unlockAudio();
    playClick();
    const idx = pieces.findIndex((p, i) => p !== correct[i]);
    if (idx === -1) return;
    const home = pieces[idx];
    const next = [...pieces];
    [next[idx], next[home]] = [next[home], next[idx]];
    setPieces(next);
    setSelected(null);
    const count = swaps + 1;
    setSwaps(count);
    tryFinish(next, count);
  };

  const handleReset = () => {
    if (solved) return;
    unlockAudio();
    playClick();
    let arr: number[];
    do {
      arr = [...correct].sort(() => Math.random() - 0.5);
    } while (arr.every((p, i) => p === correct[i]));
    setPieces(arr);
    setSelected(null);
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4">
      <div className="text-base font-semibold text-center" style={{ color: '#1A1A2E' }}>
        点选两块交换位置，完成拼图！
      </div>

      <div className="grid grid-cols-2 gap-2 w-56 h-56">
        {pieces.map((piece, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSwap(idx)}
            className="rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-card"
            style={{
              backgroundColor: puzzleColors[piece],
              border: selected === idx ? '3px solid #1A1A2E' : '3px solid transparent',
            }}
          >
            {solved ? puzzleEmojis[piece] : piece + 1}
          </motion.button>
        ))}
      </div>

      <div className="h-7">
        {solved && (
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg font-bold" style={{ color: '#00C9A7' }}>
            拼图完成！🎉
          </motion.p>
        )}
      </div>

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleHint}
          className="px-5 py-2.5 rounded-full text-white font-bold shadow-button flex items-center gap-2"
          style={{ backgroundColor: '#00C9A7' }}
        >
          <Lightbulb size={18} />
          提示
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="px-5 py-2.5 rounded-full font-bold shadow-card flex items-center gap-2 bg-white"
          style={{ color: '#6B7280' }}
        >
          <RefreshCw size={18} />
          重置
        </motion.button>
      </div>
    </div>
  );
}

function MatchGame({
  onFinish,
  gameInfo,
}: {
  onFinish: (stars: number) => void;
  gameInfo: (typeof games)[0];
}) {
  const pairs = gameInfo.matchPairs || [
    { emoji: '🐱', name: '小猫', en: 'Cat' },
    { emoji: '🐶', name: '小狗', en: 'Dog' },
    { emoji: '🐰', name: '兔子', en: 'Rabbit' },
    { emoji: '🐻', name: '小熊', en: 'Bear' },
  ];

  const [cards, setCards] = useState<{ id: number; emoji: string; matched: boolean; flipped: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const deck = [...pairs, ...pairs].map((p, i) => ({
      id: i,
      emoji: p.emoji,
      matched: false,
      flipped: false,
    }));
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [pairs]);

  const handleCardClick = (id: number) => {
    if (done) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.matched || card.flipped || selected.length >= 2) return;

    unlockAudio();
    playClick();
    speakWord(pairs.find((p) => p.emoji === card.emoji)?.en || '');

    const newCards = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setCards(newCards);

    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const first = cards.find((c) => c.id === newSelected[0]);
      const second = cards.find((c) => c.id === newSelected[1]);

      if (first && second && first.emoji === second.emoji) {
        playCorrect();
        const matchedCards = newCards.map((c) =>
          c.id === newSelected[0] || c.id === newSelected[1] ? { ...c, matched: true } : c
        );
        setCards(matchedCards);
        setSelected([]);
        setMatches((m) => m + 1);
        setAttempts((a) => a + 1);

        if (matchedCards.every((c) => c.matched)) {
          setDone(true);
          playWin();
          const stars = attempts <= pairs.length ? 3 : attempts <= pairs.length + 2 ? 2 : 1;
          window.setTimeout(() => onFinish(stars), 1200);
        }
      } else {
        playWrong();
        setAttempts((a) => a + 1);
        window.setTimeout(() => {
          setCards(cards.map((c) => (c.id === newSelected[0] || c.id === newSelected[1] ? { ...c, flipped: false } : c)));
          setSelected([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4">
      <div className="text-base font-semibold text-center" style={{ color: '#1A1A2E' }}>
        找到相同的图片配对！
      </div>

      <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(card.id)}
            className="aspect-square rounded-xl shadow-card flex items-center justify-center text-3xl"
            style={{
              backgroundColor: card.matched ? '#E6FBF4' : card.flipped ? '#F0F4FF' : '#7C5CFC',
              border: card.matched ? '2px solid #00C9A7' : '2px solid transparent',
            }}
            animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {card.flipped || card.matched ? card.emoji : '?'}
          </motion.button>
        ))}
      </div>

      <div className="h-7">
        {done && (
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg font-bold" style={{ color: '#00C9A7' }}>
            配对完成！🎉
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default function GamePlay() {
  const { type, levelId } = useParams<{ type: string; levelId: string }>();
  const navigate = useNavigate();
  const gameType = type as GameType;
  const completeGame = useLearningStore((s) => s.completeGame);
  const addStars = usePetStore((s) => s.addStars);
  const addExp = usePetStore((s) => s.addExp);
  const earnBadge = usePetStore((s) => s.earnBadge);

  const [resultStars, setResultStars] = useState<number | null>(null);
  const gameInfo = games.find((g) => g.id === levelId);

  const handleFinish = useCallback(
    (stars: number) => {
      setResultStars((prev) => {
        if (prev !== null) return prev;
        if (levelId) {
          completeGame(levelId, stars);
          addStars(stars);
          addExp(stars * 5);
          earnBadge(`game-${levelId}`);
        }
        return stars;
      });
    },
    [levelId, completeGame, addStars, addExp, earnBadge]
  );

  const handleContinue = () => navigate(`/games/${gameType}`);

  return (
    <PageLayout showTabBar={false}>
      <div className="min-h-screen" style={{ backgroundColor: '#F0F4FF' }}>
        <header className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3 bg-[#F0F4FF]/90 backdrop-blur-sm">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              unlockAudio();
              playClick();
              navigate(`/games/${gameType}`);
            }}
            className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center"
          >
            <ChevronLeft size={20} style={{ color: '#1A1A2E' }} />
          </motion.button>
          <h1 className="text-lg font-bold flex-1 text-center" style={{ color: '#1A1A2E' }}>
            {gameInfo?.titleCn ?? '游戏'}
          </h1>
          <div className="w-9" />
        </header>

        <div className="pt-4 pb-10">
          <AnimatePresence mode="wait">
            {gameType === 'pick' && gameInfo && <PickGame key="pick" onFinish={handleFinish} gameInfo={gameInfo} />}
            {gameType === 'puzzle' && <PuzzleGame key="puzzle" onFinish={handleFinish} />}
            {gameType === 'match' && gameInfo && <MatchGame key="match" onFinish={handleFinish} gameInfo={gameInfo} />}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {resultStars !== null && <ResultOverlay stars={resultStars} onContinue={handleContinue} />}
      </AnimatePresence>
    </PageLayout>
  );
}
