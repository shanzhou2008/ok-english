import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, ChevronLeft, Music, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { songs, getAudioUrl } from '@/data/songs';
import { useLearningStore } from '@/stores/useLearningStore';
import { usePetStore } from '@/stores/usePetStore';
import { unlockAudio } from '@/lib/sound';

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

export default function SongPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const song = songs.find((s) => s.id === id);
  const completeSong = useLearningStore((s) => s.completeSong);
  const addStars = usePetStore((s) => s.addStars);

  const [playing, setPlaying] = useState(false);
  const [currentLyric, setCurrentLyric] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(song?.duration || 30);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rewardedRef = useRef(false);
  const lyricsRef = useRef<HTMLDivElement>(null);
  const playingRef = useRef(false);

  useEffect(() => {
    if (song?.audioUrl) {
      setDuration(song.duration);
    }
  }, [song]);

  const updateCurrentLyric = useCallback((time: number) => {
    if (!song) return;
    for (let i = song.lyrics.length - 1; i >= 0; i--) {
      if (time >= song.lyrics[i].time) {
        setCurrentLyric(i);
        return;
      }
    }
    setCurrentLyric(0);
  }, [song]);

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    const currentTime = audioRef.current.currentTime;
    setElapsed(currentTime);
    updateCurrentLyric(currentTime);

    if (currentTime >= duration - 0.1 && !rewardedRef.current) {
      rewardedRef.current = true;
      setPlaying(false);
      playingRef.current = false;
      setCompleted(true);
      completeSong(song!.id);
      addStars(5);
    }
  }, [duration, updateCurrentLyric, completeSong, addStars, song]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    if (!rewardedRef.current) {
      rewardedRef.current = true;
      setPlaying(false);
      playingRef.current = false;
      setCompleted(true);
      completeSong(song!.id);
      addStars(5);
    }
  }, [completeSong, addStars, song]);

  const startPlayback = useCallback(() => {
    if (!song) return;

    unlockAudio();

    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
      audioRef.current.play().then(() => {
        setPlaying(true);
        playingRef.current = true;
      }).catch((err) => {
        console.error('播放失败:', err);
      });
    }
  }, [song, muted, volume]);

  const pausePlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlaying(false);
    playingRef.current = false;
  }, []);

  const togglePlay = useCallback(() => {
    unlockAudio();
    if (playing) {
      pausePlayback();
    } else {
      if (elapsed >= duration - 0.5 || completed) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
        setElapsed(0);
        setCurrentLyric(0);
        setCompleted(false);
        rewardedRef.current = false;
      }
      startPlayback();
    }
  }, [playing, pausePlayback, startPlayback, elapsed, duration, completed]);

  const handleRestart = useCallback(() => {
    unlockAudio();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setElapsed(0);
    setCurrentLyric(0);
    setCompleted(false);
    rewardedRef.current = false;
    setPlaying(false);
    playingRef.current = false;
    setTimeout(() => startPlayback(), 50);
  }, [startPlayback]);

  const handleSkip = useCallback(
    (dir: number) => {
      if (!audioRef.current || !song) return;
      const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + dir * 5));
      audioRef.current.currentTime = newTime;
      setElapsed(newTime);
      updateCurrentLyric(newTime);
    },
    [song, duration, updateCurrentLyric],
  );

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !song) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setElapsed(newTime);
      updateCurrentLyric(newTime);
    },
    [song, duration, updateCurrentLyric],
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [muted, volume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      playingRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!lyricsRef.current) return;
    const active = lyricsRef.current.querySelector('[data-active="true"]');
    active?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentLyric]);

  if (!song) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#F0F4FF] to-[#E5E7EB]">
        <p className="text-[#6B7280]">歌曲未找到</p>
      </div>
    );
  }

  const progress = duration > 0 ? (elapsed / duration) * 100 : 0;

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-[#F0F4FF] via-[#E0F2FE] to-[#FCE7F3] overflow-hidden">
      {playing && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 10 + Math.random() * 20,
                height: 10 + Math.random() * 20,
                backgroundColor: song.color,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100 - Math.random() * 100],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0, 0.4, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}

      {song.audioUrl && (
        <audio
          ref={audioRef}
          src={song.audioUrl ? getAudioUrl(song.audioUrl) : undefined}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
        />
      )}

      <header className="relative z-10 flex items-center px-4 py-3 bg-white/70 backdrop-blur-md">
        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.pause();
            }
            playingRef.current = false;
            navigate('/songs');
          }}
          className="p-2 rounded-full bg-white/80 shadow-sm"
        >
          <ChevronLeft size={24} className="text-[#1A1A2E]" />
        </button>
        <h1 className="flex-1 truncate text-center text-lg font-bold text-[#1A1A2E]">
          {song.title}
        </h1>
        <button onClick={() => setMuted(!muted)} className="p-2 rounded-full bg-white/80 shadow-sm">
          {muted ? (
            <VolumeX size={20} className="text-[#6B7280]" />
          ) : (
            <Volume2 size={20} className="text-[#1A1A2E]" />
          )}
        </button>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-6">
        <div className="relative">
          <motion.div
            animate={playing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="h-[200px] w-[200px] overflow-hidden rounded-full shadow-2xl flex items-center justify-center text-8xl ring-4 ring-white/50"
            style={{ background: `linear-gradient(135deg, ${song.color}33, ${song.color}99)` }}
          >
            {song.emoji}
          </motion.div>
          
          {playing && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `3px solid ${song.color}` }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          {playing &&
            [0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="pointer-events-none absolute"
                style={{ top: 20 + i * 30, left: -30 + i * 40, color: song.color }}
                animate={{ 
                  y: [-15, 15, -15], 
                  opacity: [0.3, 1, 0.3], 
                  rotate: [0, 20, -20, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.3 }}
              >
                <Music size={20 + i * 5} />
              </motion.div>
            ))}
        </div>

        <motion.div
          animate={playing ? { y: [-5, 5, -5] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6 text-center"
        >
          <h2 className="text-2xl font-black text-[#1A1A2E]">{song.title}</h2>
          <p className="text-sm text-[#6B7280] mt-1">{song.titleCn}</p>
        </motion.div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ backgroundColor: `${song.color}22`, color: song.color }}>
            {song.category}
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-bold bg-white/80 text-[#6B7280]">
            {formatTime(duration)}
          </span>
        </div>

        <div
          ref={lyricsRef}
          className="mt-6 max-h-56 w-full space-y-3 overflow-y-auto scroll-smooth no-scrollbar"
        >
          {song.lyrics.map((line, i) => (
            <motion.p
              key={i}
              data-active={i === currentLyric}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: i === currentLyric ? 1 : 0.6, 
                y: 0,
                scale: i === currentLyric ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`py-2 px-4 rounded-xl text-center text-sm transition-all duration-300 ${
                i === currentLyric
                  ? 'font-black'
                  : 'font-normal'
              }`}
              style={{ 
                color: i === currentLyric ? song.color : '#6B7280',
                backgroundColor: i === currentLyric ? `${song.color}11` : 'transparent',
              }}
            >
              {line.text}
            </motion.p>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <div
          className="relative h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-[#7C5CFC]/20"
          onClick={handleProgressClick}
        >
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: song.color }}
            transition={{ duration: 0.1 }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-md"
            style={{ left: `${progress}%`, marginLeft: '-6px' }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs font-semibold text-[#6B7280]">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-8">
          <button onClick={() => handleSkip(-1)} className="p-2">
            <SkipBack size={26} className="text-[#1A1A2E]" />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-16 w-16 items-center justify-center rounded-full shadow-button active:scale-95"
            style={{ backgroundColor: song.color }}
          >
            {playing ? (
              <Pause size={28} className="fill-white text-white" />
            ) : (
              <Play size={28} className="ml-1 fill-white text-white" />
            )}
          </button>
          <button onClick={() => handleSkip(1)} className="p-2">
            <SkipForward size={26} className="text-[#1A1A2E]" />
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ color: song.color }}
          >
            <RotateCcw size={16} />
            重新开始
          </button>
        </div>
      </div>

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              {[...Array(14)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: ['#7C5CFC', '#FF6B9D', '#00C9A7', '#FFA94D'][i % 4],
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                  }}
                  animate={{ y: [-20, 20], x: [-10, 10], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
              <p className="mb-2 text-4xl">🎉</p>
              <p className="text-2xl font-extrabold text-[#1A1A2E]">太棒了!</p>
              <p className="mt-1 text-lg font-bold text-[#FFA94D]">+5 ⭐</p>
              <button
                className="mt-5 rounded-full px-6 py-2.5 font-bold text-white shadow-button active:scale-95"
                style={{ backgroundColor: song.color }}
                onClick={handleRestart}
              >
                再听一次
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
