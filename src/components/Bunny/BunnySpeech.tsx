import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BunnySpeechProps {
  text: string;
  position?: 'left' | 'right' | 'top';
}

// Tail anchor: small triangle pointing toward the bunny
const tailStyle: Record<'left' | 'right' | 'top', React.CSSProperties> = {
  left: {
    bottom: 14,
    left: -6,
    borderRightColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: 'rotate(45deg)',
  },
  right: {
    bottom: 14,
    right: -6,
    borderLeftColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    transform: 'rotate(45deg)',
  },
  top: {
    top: -6,
    left: '50%',
    marginLeft: -6,
    borderBottomColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: 'rotate(45deg)',
  },
};

export default function BunnySpeech({ text, position = 'left' }: BunnySpeechProps) {
  const wrapperFlex: Record<string, string> = {
    left: 'flex-row',
    right: 'flex-row-reverse',
    top: 'flex-col items-center',
  };

  return (
    <motion.div
      className={cn('inline-flex items-start gap-3', wrapperFlex[position])}
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
    >
      <div className="relative">
        <div
          className="max-w-[220px] rounded-2xl px-4 py-3"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#1A1A2E',
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.45,
            boxShadow: '0 4px 16px rgba(124,92,252,0.10)',
          }}
        >
          {text}
        </div>
        {/* Triangle tail */}
        <div
          style={{
            position: 'absolute',
            width: 12,
            height: 12,
            borderWidth: 6,
            borderStyle: 'solid',
            ...tailStyle[position],
          }}
        />
      </div>
    </motion.div>
  );
}
