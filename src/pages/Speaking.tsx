import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, MicOff, ChevronRight, RefreshCw } from 'lucide-react';
import PageLayout from '@/components/Layout/PageLayout';
import BunnyMascot from '@/components/Bunny/BunnyMascot';
import BunnySpeech from '@/components/Bunny/BunnySpeech';
import StarRating from '@/components/StarRating/StarRating';
import { useLearningStore } from '@/stores/useLearningStore';
import { usePetStore } from '@/stores/usePetStore';
import { unlockAudio, speakWord, playClick, playCorrect, playWin } from '@/lib/sound';

const WORDS = [
  { en: 'Apple', zh: '苹果', phonetic: '/ˈæp.əl/' },
  { en: 'Banana', zh: '香蕉', phonetic: '/bəˈnɑː.nə/' },
  { en: 'Cat', zh: '猫', phonetic: '/kæt/' },
  { en: 'Dog', zh: '狗', phonetic: '/dɒɡ/' },
  { en: 'Hello', zh: '你好', phonetic: '/həˈloʊ/' },
  { en: 'Thank you', zh: '谢谢', phonetic: '/θæŋk juː/' },
  { en: 'Good morning', zh: '早上好', phonetic: '/ɡʊd ˈmɔːr.nɪŋ/' },
  { en: 'Red', zh: '红色', phonetic: '/red/' },
  { en: 'Blue', zh: '蓝色', phonetic: '/bluː/' },
  { en: 'Happy', zh: '开心', phonetic: '/ˈhæp.i/' },
];

const TIPS = ['注意 /æ/ 的发音哦', '嘴巴张大一点试试', '声调再高一些', '尾音可以更清晰', '慢慢来，不着急'];

type Phase = 'idle' | 'playing' | 'recording' | 'evaluating' | 'result' | 'summary';

export default function Speaking() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [tip, setTip] = useState('');
  const { setSpeakingScore, addMinutes } = useLearningStore();
  const { addExp, addStars } = usePetStore();

  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const evalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
      if (recordTimerRef.current) clearTimeout(recordTimerRef.current);
      if (evalTimerRef.current) clearTimeout(evalTimerRef.current);
    },
    [],
  );

  const word = WORDS[index];
  const progress = `${index + 1}/${WORDS.length}`;
  const bunnyMood =
    phase === 'summary' ? 'excited' : score >= 3 ? 'excited' : score === 2 ? 'happy' : score === 1 ? 'thinking' : 'happy';
  const scoreMsg = score >= 3 ? '完美发音!' : score === 2 ? '很棒！继续加油！' : score === 1 ? '再试一次吧！' : '';
  const scoreColor = score >= 3 ? '#00B894' : score === 2 ? '#7C5CFC' : '#4D9DE0';

  const handlePlay = useCallback(() => {
    unlockAudio();
    playClick();
    setPhase((prev) => {
      if (prev !== 'idle' && prev !== 'result') return prev;
      speakWord(word.en);
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
      playTimerRef.current = setTimeout(() => setPhase('idle'), 1500);
      return 'playing';
    });
  }, [word.en]);

  const handleRecordStart = useCallback(() => {
    unlockAudio();
    playClick();
    setPhase((prev) => {
      if (prev !== 'idle') return prev;
      recordTimerRef.current = setTimeout(() => {
        setPhase('evaluating');
        evalTimerRef.current = setTimeout(() => {
          const s = Math.floor(Math.random() * 3) + 1;
          setScore(s);
          setTip(s < 3 ? TIPS[Math.floor(Math.random() * TIPS.length)] : '');
          setTotalStars((t) => t + s);
          addExp(s * 5);
          addStars(s);
          if (s >= 3) playCorrect();
          else if (s === 2) playClick();
          setPhase('result');
        }, 800);
      }, 3000);
      return 'recording';
    });
  }, [addExp, addStars]);

  const handleRecordEnd = useCallback(() => {
    if (recordTimerRef.current) {
      clearTimeout(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setPhase((prev) => {
      if (prev !== 'recording') return prev;
      setPhase('evaluating');
      evalTimerRef.current = setTimeout(() => {
        const s = Math.floor(Math.random() * 3) + 1;
        setScore(s);
        setTip(s < 3 ? TIPS[Math.floor(Math.random() * TIPS.length)] : '');
        setTotalStars((t) => t + s);
        addExp(s * 5);
        addStars(s);
        if (s >= 3) playCorrect();
        else if (s === 2) playClick();
        setPhase('result');
      }, 800);
      return 'evaluating';
    });
  }, [addExp, addStars]);

  const handleNext = useCallback(() => {
    playClick();
    if (index < WORDS.length - 1) {
      setIndex((i) => i + 1);
      setPhase('idle');
      setScore(0);
      setTip('');
    } else {
      playWin();
      setSpeakingScore(totalStars);
      addMinutes(5);
      setPhase('summary');
    }
  }, [index, totalStars, setSpeakingScore, addMinutes]);

  const handleRestart = useCallback(() => {
    playClick();
    setIndex(0);
    setPhase('idle');
    setScore(0);
    setTotalStars(0);
    setTip('');
  }, []);

  if (phase === 'summary') {
    return (
      <PageLayout showTabBar>
        <div className="flex flex-col items-center px-6 pt-16">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
            <BunnyMascot size="lg" mood="excited" />
          </motion.div>
          <motion.div
            className="mt-6 bg-white rounded-2xl shadow-card p-8 text-center w-full max-w-xs"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A2E' }}>练习完成！</h2>
            <p className="text-base mb-4" style={{ color: '#6B7280' }}>你一共获得了</p>
            <div className="flex justify-center mb-2"><StarRating count={3} size={36} /></div>
            <p className="text-4xl font-bold" style={{ color: '#7C5CFC' }}>{totalStars} <span className="text-2xl">⭐</span></p>
            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>总共星星数</p>
          </motion.div>
          <motion.button
            className="mt-8 flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold text-lg shadow-button"
            style={{ background: 'linear-gradient(135deg, #7C5CFC, #9D85FD)' }}
            whileTap={{ scale: 0.95 }} onClick={handleRestart}>
            <RefreshCw size={20} /> 再来一次
          </motion.button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showTabBar>
      <div className="flex flex-col items-center px-4 pt-4 pb-8">
        {/* Header with progress pill */}
        <div className="w-full max-w-sm flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BunnyMascot size="sm" mood={bunnyMood} />
            <h1 className="text-lg font-bold" style={{ color: '#1A1A2E' }}>口语跟读</h1>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: '#7C5CFC', color: '#FFFFFF' }}>
            {progress}
          </span>
        </div>

        {/* Word Card */}
        <motion.div
          className="w-full max-w-sm bg-white rounded-2xl shadow-card p-6 text-center mb-6"
          key={word.en}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
          <p className="text-4xl font-bold mb-2" style={{ color: '#1A1A2E' }}>{word.en}</p>
          <p className="text-lg mb-1" style={{ color: '#6B7280' }}>{word.zh}</p>
          <p className="text-sm" style={{ color: '#7C5CFC' }}>{word.phonetic}</p>
        </motion.div>

        {/* Listen Button */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
            {phase === 'playing' && [0, 1, 2].map((i) => (
              <motion.div key={i} className="absolute rounded-full border-2"
                style={{ borderColor: '#7C5CFC', width: 80, height: 80 }}
                initial={{ scale: 1, opacity: 0.6 }} animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }} />
            ))}
            <motion.button
              className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-button"
              style={{ background: 'linear-gradient(135deg, #7C5CFC, #9D85FD)' }}
              whileTap={{ scale: 0.9 }}
              animate={phase === 'playing' ? { scale: [1, 1.08, 1] } : {}}
              transition={phase === 'playing' ? { duration: 0.8, repeat: Infinity } : {}}
              onClick={handlePlay}>
              <Volume2 size={32} />
            </motion.button>
          </div>
          <span className="mt-2 text-sm font-semibold" style={{ color: '#6B7280' }}>听标准发音</span>
        </div>

        {/* Record Button */}
        <div className="flex flex-col items-center mb-5">
          <motion.button
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-button"
            style={{ background: phase === 'recording' ? '#EF4444' : '#FF6B9D' }}
            whileTap={{ scale: 0.92 }}
            animate={phase === 'recording' ? { scale: [1, 1.1, 1] } : {}}
            transition={phase === 'recording' ? { duration: 0.6, repeat: Infinity } : {}}
            onMouseDown={handleRecordStart}
            onMouseUp={handleRecordEnd}
            onMouseLeave={handleRecordEnd}
            onTouchStart={(e) => { e.preventDefault(); handleRecordStart(); }}
            onTouchEnd={(e) => { e.preventDefault(); handleRecordEnd(); }}
            disabled={phase !== 'idle'}>
            {phase === 'recording' ? <MicOff size={36} className="text-white" /> : <Mic size={36} className="text-white" />}
          </motion.button>
          <span className="mt-2 text-sm font-semibold" style={{ color: '#6B7280' }}>
            {phase === 'recording' ? '录音中...' : '按住跟我读'}
          </span>
        </div>

        {/* Evaluating indicator */}
        <AnimatePresence>
          {phase === 'evaluating' && (
            <motion.div className="flex items-center gap-2 py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {['#7C5CFC', '#FF6B9D', '#00C9A7'].map((c, i) => (
                <motion.div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }}
                  animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Score Result */}
        <AnimatePresence>
          {phase === 'result' && (
            <motion.div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-5 text-center"
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <p className="text-sm font-medium mb-1" style={{ color: '#6B7280' }}>发音评分</p>
              <StarRating count={score} size={36} />
              <motion.p className="text-xl font-bold mt-2" style={{ color: scoreColor }} initial={{ y: 10 }} animate={{ y: 0 }}>
                {scoreMsg}
              </motion.p>
              {tip && (
                <div className="mt-3 flex justify-center">
                  <BunnySpeech text={tip} position="top" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <AnimatePresence>
          {phase === 'result' && (
            <motion.button
              className="mt-4 flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold text-lg shadow-button"
              style={{ background: 'linear-gradient(135deg, #7C5CFC, #9D85FD)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              onClick={handleNext}>
              {index < WORDS.length - 1 ? '下一个' : '完成'} <ChevronRight size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
