const BASE_URL = import.meta.env.BASE_URL || '/';

// Web Audio API 音效工具 - 不需要音频文件，用代码合成音效
let audioCtx: AudioContext | null = null;
let voicesReady = false;
let initAttempts = 0;

function waitForVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesReady = true;
      resolve();
      return;
    }
    const onVoicesChanged = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        voicesReady = true;
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve();
      }
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve();
    }, 3000);
  });
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  waitForVoices();
}

export function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AC();
    } catch (e) {
      console.warn('AudioContext creation failed:', e);
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function unlockAudio() {
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0.01;
      u.rate = 2;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch {
      // ignore
    }
  }
}

interface ToneOpts {
  freq: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  delay?: number;
}

function playTone({ freq, duration, type = 'sine', volume = 0.3, delay = 0 }: ToneOpts) {
  const ctx = getCtx();
  if (!ctx) return;

  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);

  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function playToneImmediate(opts: ToneOpts) {
  const ctx = getCtx();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      playTone(opts);
    }).catch(() => {});
    return;
  }

  playTone(opts);
}

export function playClick() {
  playToneImmediate({ freq: 880, duration: 0.06, type: 'sine', volume: 0.2 });
}

export function playCorrect() {
  playToneImmediate({ freq: 523, duration: 0.1, type: 'sine', volume: 0.3 });
  playToneImmediate({ freq: 659, duration: 0.1, type: 'sine', volume: 0.3, delay: 0.1 });
  playToneImmediate({ freq: 784, duration: 0.15, type: 'sine', volume: 0.3, delay: 0.2 });
}

export function playWrong() {
  playToneImmediate({ freq: 280, duration: 0.12, type: 'square', volume: 0.15 });
  playToneImmediate({ freq: 200, duration: 0.18, type: 'square', volume: 0.15, delay: 0.1 });
}

export function playWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => {
    playToneImmediate({ freq: f, duration: 0.2, type: 'triangle', volume: 0.3, delay: i * 0.15 });
  });
}

export function playPop() {
  playToneImmediate({ freq: 600, duration: 0.05, type: 'sine', volume: 0.15 });
  playToneImmediate({ freq: 900, duration: 0.05, type: 'sine', volume: 0.12, delay: 0.03 });
}

// ==================== Word Pronunciation (MP3 Audio) ====================
//
// 音色版本配置：
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │ 版本 1: rate=0.65, pitch=1.1, 优先 Google 语音                     │
// │ 版本 2: rate=0.75, pitch=1.3, 优先 Microsoft/Samantha 童趣语音      │
// │ 版本 3: 优先使用 MP3 音频文件，Web Speech API 作为备选                │
// │ 版本 4 (当前): 全部使用有道词典美式女声 MP3 音频，音色统一自然          │
// └─────────────────────────────────────────────────────────────────────────────┘

// 当前使用的音色版本
// 版本 4: 全部使用有道词典美式女声 MP3 音频，音色统一自然
const VOICE_VERSION = 4;

// 版本配置 - 版本 4 使用有道美式女声 MP3，不需要 TTS 配置
const VOICE_CONFIG = {
  rate: 1.0,
  pitch: 1.0,
  volume: 1,
};

// MP3 音频播放器（优先使用，音色更自然）
let currentAudio: HTMLAudioElement | null = null;

function getWordAudioUrl(word: string): string {
  const fileName = word.trim().toLowerCase().replace(/\s+/g, '-');
  return `${BASE_URL}words/${fileName}.mp3`;
}

function getAdjustedVolume(word: string): number {
  const trimmed = word.trim();
  if (/^[A-Za-z]$/.test(trimmed)) {
    return 1.8;
  }
  return 1.0;
}

function selectVoice(voices: SpeechSynthesisVoice[], version: number): SpeechSynthesisVoice | null {
  if (version === 3) {
    // 版本 3: 优先选择自然柔和的本地语音
    return voices.find((v) => v.lang === 'en-US' && v.localService) ||
           voices.find((v) => v.lang === 'en-US' && v.name.includes('Samantha')) ||
           voices.find((v) => v.lang === 'en-US' && v.name.includes('Alex')) ||
           voices.find((v) => v.lang.startsWith('en-US')) ||
           voices.find((v) => v.lang.startsWith('en')) ||
           null;
  } else if (version === 2) {
    // 版本 2: 优先选择 Microsoft 或 Samantha 等童趣语音
    return voices.find((v) => v.lang === 'en-US' && v.name.includes('Microsoft')) ||
           voices.find((v) => v.lang === 'en-US' && v.name.includes('Samantha')) ||
           voices.find((v) => v.lang === 'en-US' && v.name.includes('Zira')) ||
           voices.find((v) => v.lang === 'en-US' && v.name.includes('Mark')) ||
           voices.find((v) => v.lang === 'en-US' && v.localService) ||
           voices.find((v) => v.lang.startsWith('en-US')) ||
           voices.find((v) => v.lang.startsWith('en')) ||
           null;
  } else {
    // 版本 1: 优先 Google 语音
    return voices.find((v) => v.lang === 'en-US' && v.name.includes('Google')) ||
           voices.find((v) => v.lang === 'en-US' && v.localService) ||
           voices.find((v) => v.lang.startsWith('en-US')) ||
           voices.find((v) => v.lang.startsWith('en')) ||
           null;
  }
}

export function speakWord(word: string) {
  if (!word) return;
  unlockAudio();

  const audioUrl = getWordAudioUrl(word);

  // 版本 4: 全部使用有道美式女声 MP3 音频
  if (VOICE_VERSION >= 3 && audioUrl) {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    const audio = new Audio(audioUrl);
    audio.crossOrigin = 'anonymous';
    audio.playbackRate = VOICE_VERSION === 4 ? 1.0 : 0.9;
    audio.volume = getAdjustedVolume(word);
    currentAudio = audio;
    
    audio.play().catch(() => {
      speakWithTTS(word);
    });
    
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
    };
    
    audio.onerror = () => {
      speakWithTTS(word);
    };
    
    return;
  }

  speakWithTTS(word);
}

function speakWithTTS(word: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  
  try {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-US';
    u.rate = VOICE_CONFIG.rate;
    u.pitch = VOICE_CONFIG.pitch;
    u.volume = VOICE_CONFIG.volume;

    const voices = window.speechSynthesis.getVoices();
    const enVoice = selectVoice(voices, VOICE_VERSION);
    if (enVoice) {
      u.voice = enVoice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    // ignore
  }
}

export function speakSequence(texts: { text: string; delay: number }[]): () => void {
  let cancelled = false;
  let currentIndex = 0;

  function playNext() {
    if (cancelled || currentIndex >= texts.length) return;
    const item = texts[currentIndex];

    // 版本 3/4: 优先尝试 MP3 音频文件（有道美式女声）
    if (VOICE_VERSION >= 3) {
      const audioUrl = getWordAudioUrl(item.text);
      const audio = new Audio(audioUrl);
      audio.crossOrigin = 'anonymous';
      audio.playbackRate = VOICE_VERSION === 4 ? 1.0 : 0.9;
      audio.volume = getAdjustedVolume(item.text);

      audio.onended = () => {
        currentIndex++;
        if (currentIndex < texts.length && !cancelled) {
          window.setTimeout(playNext, item.delay || 1200);
        }
      };

      audio.onerror = () => {
        playNextWithTTS(item.text, item.delay);
      };

      audio.play().catch(() => {
        playNextWithTTS(item.text, item.delay);
      });
      return;
    }

    playNextWithTTS(item.text, item.delay);
  }

  function playNextWithTTS(text: string, delay: number) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = VOICE_CONFIG.rate;
    u.pitch = VOICE_CONFIG.pitch;
    u.volume = VOICE_CONFIG.volume;

    const voices = window.speechSynthesis.getVoices();
    const enVoice = selectVoice(voices, VOICE_VERSION);
    if (enVoice) {
      u.voice = enVoice;
    }

    u.onend = () => {
      currentIndex++;
      if (currentIndex < texts.length && !cancelled) {
        window.setTimeout(playNext, delay || 1200);
      }
    };
    u.onerror = () => {
      currentIndex++;
      if (currentIndex < texts.length && !cancelled) {
        window.setTimeout(playNext, delay || 1200);
      }
    };

    window.speechSynthesis.speak(u);
  }

  unlockAudio();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    playNext();
  }

  return () => {
    cancelled = true;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
}

export function stopSpeak() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export { waitForVoices };
