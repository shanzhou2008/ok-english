import { getCtx } from './sound';

export interface Note {
  freq: number;
  duration: number;
  delay?: number;
}

const NOTE_FREQS: Record<string, number> = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
  'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
  'G5': 783.99, 'A5': 880.00,
};

export const MELODIES: Record<string, Note[]> = {
  'twinkle-twinkle': [
    { freq: NOTE_FREQS['C4'], duration: 0.4 }, { freq: NOTE_FREQS['C4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['A4'], duration: 0.4 }, { freq: NOTE_FREQS['A4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.8 },
    { freq: NOTE_FREQS['F4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['C4'], duration: 0.8 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['F4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.8 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['F4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.8 },
    { freq: NOTE_FREQS['C4'], duration: 0.4 }, { freq: NOTE_FREQS['C4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['A4'], duration: 0.4 }, { freq: NOTE_FREQS['A4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.8 },
    { freq: NOTE_FREQS['F4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['C4'], duration: 0.8 },
  ],
  'abc-song': [
    { freq: NOTE_FREQS['C4'], duration: 0.35 }, { freq: NOTE_FREQS['D4'], duration: 0.35 },
    { freq: NOTE_FREQS['E4'], duration: 0.35 }, { freq: NOTE_FREQS['F4'], duration: 0.35 },
    { freq: NOTE_FREQS['G4'], duration: 0.35 }, { freq: NOTE_FREQS['A4'], duration: 0.35 },
    { freq: NOTE_FREQS['B4'], duration: 0.35 }, { freq: NOTE_FREQS['C5'], duration: 0.7 },
    { freq: NOTE_FREQS['F4'], duration: 0.35 }, { freq: NOTE_FREQS['E4'], duration: 0.35 },
    { freq: NOTE_FREQS['D4'], duration: 0.35 }, { freq: NOTE_FREQS['C4'], duration: 0.7 },
    { freq: NOTE_FREQS['G4'], duration: 0.35 }, { freq: NOTE_FREQS['F4'], duration: 0.35 },
    { freq: NOTE_FREQS['E4'], duration: 0.35 }, { freq: NOTE_FREQS['D4'], duration: 0.7 },
    { freq: NOTE_FREQS['C4'], duration: 0.35 }, { freq: NOTE_FREQS['G4'], duration: 0.35 },
    { freq: NOTE_FREQS['E4'], duration: 0.35 }, { freq: NOTE_FREQS['G4'], duration: 0.35 },
    { freq: NOTE_FREQS['C5'], duration: 0.7 }, { freq: NOTE_FREQS['B4'], duration: 0.35 },
    { freq: NOTE_FREQS['A4'], duration: 0.35 }, { freq: NOTE_FREQS['G4'], duration: 0.7 },
    { freq: NOTE_FREQS['A4'], duration: 0.35 }, { freq: NOTE_FREQS['B4'], duration: 0.35 },
    { freq: NOTE_FREQS['C5'], duration: 1.0 },
  ],
  'row-row-row': [
    { freq: NOTE_FREQS['C4'], duration: 0.5 }, { freq: NOTE_FREQS['C4'], duration: 0.5 },
    { freq: NOTE_FREQS['C4'], duration: 0.5 },
    { freq: NOTE_FREQS['D4'], duration: 0.5 }, { freq: NOTE_FREQS['E4'], duration: 1.0 },
    { freq: NOTE_FREQS['E4'], duration: 0.5 }, { freq: NOTE_FREQS['D4'], duration: 0.5 },
    { freq: NOTE_FREQS['E4'], duration: 0.5 }, { freq: NOTE_FREQS['F4'], duration: 0.5 },
    { freq: NOTE_FREQS['G4'], duration: 1.0 },
    { freq: NOTE_FREQS['C5'], duration: 0.4 }, { freq: NOTE_FREQS['C5'], duration: 0.4 },
    { freq: NOTE_FREQS['C5'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['C4'], duration: 0.4 }, { freq: NOTE_FREQS['C4'], duration: 0.4 },
    { freq: NOTE_FREQS['C4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.5 }, { freq: NOTE_FREQS['F4'], duration: 0.5 },
    { freq: NOTE_FREQS['E4'], duration: 0.5 }, { freq: NOTE_FREQS['D4'], duration: 0.5 },
    { freq: NOTE_FREQS['C4'], duration: 1.0 },
  ],
  'old-macdonald': [
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.8 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['A4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.8 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.8 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['A4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.8 },
  ],
  'mary-little-lamb': [
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['C4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.8 },
    { freq: NOTE_FREQS['D4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.8 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.8 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['C4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['C4'], duration: 0.8 },
  ],
  'head-shoulders': [
    { freq: NOTE_FREQS['C4'], duration: 0.35 }, { freq: NOTE_FREQS['D4'], duration: 0.35 },
    { freq: NOTE_FREQS['E4'], duration: 0.35 }, { freq: NOTE_FREQS['F4'], duration: 0.35 },
    { freq: NOTE_FREQS['G4'], duration: 0.7 }, { freq: NOTE_FREQS['G4'], duration: 0.35 },
    { freq: NOTE_FREQS['F4'], duration: 0.35 }, { freq: NOTE_FREQS['E4'], duration: 0.35 },
    { freq: NOTE_FREQS['D4'], duration: 0.35 }, { freq: NOTE_FREQS['C4'], duration: 0.7 },
    { freq: NOTE_FREQS['E4'], duration: 0.35 }, { freq: NOTE_FREQS['G4'], duration: 0.35 },
    { freq: NOTE_FREQS['G4'], duration: 0.35 }, { freq: NOTE_FREQS['A4'], duration: 0.35 },
    { freq: NOTE_FREQS['G4'], duration: 0.7 },
    { freq: NOTE_FREQS['F4'], duration: 0.35 }, { freq: NOTE_FREQS['E4'], duration: 0.35 },
    { freq: NOTE_FREQS['D4'], duration: 0.35 }, { freq: NOTE_FREQS['C4'], duration: 0.7 },
  ],
  'wheels-on-the-bus': [
    { freq: NOTE_FREQS['C4'], duration: 0.4 }, { freq: NOTE_FREQS['C4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['A4'], duration: 0.4 },
    { freq: NOTE_FREQS['B4'], duration: 0.4 }, { freq: NOTE_FREQS['A4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.8 },
    { freq: NOTE_FREQS['F4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['C4'], duration: 0.8 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['F4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.8 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['F4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.8 },
    { freq: NOTE_FREQS['C4'], duration: 0.4 }, { freq: NOTE_FREQS['C4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['A4'], duration: 0.4 },
    { freq: NOTE_FREQS['B4'], duration: 0.4 }, { freq: NOTE_FREQS['A4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.8 },
  ],
  'if-youre-happy': [
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['A4'], duration: 0.4 }, { freq: NOTE_FREQS['B4'], duration: 0.4 },
    { freq: NOTE_FREQS['C5'], duration: 0.8 },
    { freq: NOTE_FREQS['C5'], duration: 0.4 }, { freq: NOTE_FREQS['B4'], duration: 0.4 },
    { freq: NOTE_FREQS['A4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['A4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.8 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['A4'], duration: 0.4 }, { freq: NOTE_FREQS['B4'], duration: 0.4 },
    { freq: NOTE_FREQS['C5'], duration: 0.8 },
    { freq: NOTE_FREQS['C5'], duration: 0.4 }, { freq: NOTE_FREQS['B4'], duration: 0.4 },
    { freq: NOTE_FREQS['A4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['C4'], duration: 0.8 },
  ],
  'five-little-ducks': [
    { freq: NOTE_FREQS['C4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.8 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['A4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.8 },
    { freq: NOTE_FREQS['C4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.8 },
    { freq: NOTE_FREQS['C5'], duration: 0.4 }, { freq: NOTE_FREQS['B4'], duration: 0.4 },
    { freq: NOTE_FREQS['A4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['F4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.4 }, { freq: NOTE_FREQS['C4'], duration: 0.8 },
  ],
  'rainbow-song': [
    { freq: NOTE_FREQS['C4'], duration: 0.4 }, { freq: NOTE_FREQS['C4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['A4'], duration: 0.4 }, { freq: NOTE_FREQS['A4'], duration: 0.4 },
    { freq: NOTE_FREQS['G4'], duration: 0.8 },
    { freq: NOTE_FREQS['F4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.4 }, { freq: NOTE_FREQS['D4'], duration: 0.4 },
    { freq: NOTE_FREQS['C4'], duration: 0.8 },
    { freq: NOTE_FREQS['G4'], duration: 0.4 }, { freq: NOTE_FREQS['G4'], duration: 0.4 },
    { freq: NOTE_FREQS['F4'], duration: 0.4 }, { freq: NOTE_FREQS['F4'], duration: 0.4 },
    { freq: NOTE_FREQS['E4'], duration: 0.4 }, { freq: NOTE_FREQS['E4'], duration: 0.4 },
    { freq: NOTE_FREQS['D4'], duration: 0.8 },
  ],
};

export interface MelodyPlayer {
  play: (songId: string, startTime?: number) => void;
  pause: () => void;
  stop: () => void;
  setVolume: (vol: number) => void;
}

export function createMelodyPlayer(): MelodyPlayer {
  const ctx = getCtx();
  let activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  let isPlaying = false;
  let volume = 0.15;
  let startTimeOffset = 0;

  const stopAll = () => {
    activeOscillators.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(ctx ? ctx.currentTime : 0);
        osc.stop();
      } catch {
        // ignore
      }
    });
    activeOscillators = [];
    isPlaying = false;
  };

  const play = (songId: string, startTime = 0) => {
    if (!ctx) return;
    stopAll();
    isPlaying = true;
    startTimeOffset = startTime;

    const melody = MELODIES[songId];
    if (!melody || melody.length === 0) return;

    const now = ctx.currentTime + 0.05;
    let cumulativeTime = 0;
    let skipUntil = startTime;

    melody.forEach((note) => {
      const noteDelay = note.delay ?? 0;
      const noteStartTime = cumulativeTime + noteDelay;
      const noteEndTime = noteStartTime + note.duration;
      cumulativeTime = noteEndTime;

      if (noteEndTime <= skipUntil) return;

      const relativeStart = Math.max(0, noteStartTime - skipUntil);
      const actualDuration = note.duration - (skipUntil > noteStartTime ? skipUntil - noteStartTime : 0);
      if (actualDuration <= 0) return;

      const t0 = now + relativeStart;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, t0);

      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(volume, t0 + 0.03);
      gain.gain.setValueAtTime(volume, t0 + actualDuration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + actualDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t0);
      osc.stop(t0 + actualDuration + 0.05);

      activeOscillators.push({ osc, gain });
    });
  };

  const pause = () => {
    stopAll();
  };

  const stop = () => {
    stopAll();
    startTimeOffset = 0;
  };

  const setVolume = (vol: number) => {
    volume = Math.max(0, Math.min(1, vol));
    if (ctx) {
      activeOscillators.forEach(({ gain }) => {
        try {
          const now = ctx.currentTime;
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(volume, now);
        } catch {
          // ignore
        }
      });
    }
  };

  return { play, pause, stop, setVolume };
}
