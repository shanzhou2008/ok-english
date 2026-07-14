import { useId } from 'react';
import { motion } from 'framer-motion';

interface RingProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const PRIMARY = '#7C5CFC';
const SECONDARY = '#FF6B9D';
const TRACK = '#E5E7EB';

export default function RingProgress({ percentage, size = 120, strokeWidth = 10 }: RingProgressProps) {
  const rawId = useId();
  const gradientId = `ring-gradient-${rawId.replace(/:/g, '')}`;
  const clamped = Math.max(0, Math.min(100, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY} />
            <stop offset="100%" stopColor={SECONDARY} />
          </linearGradient>
        </defs>

        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={TRACK}
          strokeWidth={strokeWidth}
        />

        {/* Progress ring */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>

      {/* Center percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="font-extrabold"
          style={{ color: PRIMARY, fontSize: size * 0.24, lineHeight: 1 }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
        >
          {clamped}%
        </motion.span>
      </div>
    </div>
  );
}
