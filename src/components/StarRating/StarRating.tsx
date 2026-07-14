import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface StarRatingProps {
  count: number;
  size?: number;
}

const GOLD = '#FFD700';
const EMPTY = '#E5E7EB';

export default function StarRating({ count, size = 32 }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(3, count));

  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3].map((star) => {
        const filled = star <= clamped;
        return (
          <motion.div
            key={star}
            initial={{ scale: 0, rotate: -40, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 14,
              delay: star * 0.12,
            }}
          >
            <Star
              size={size}
              fill={filled ? GOLD : 'none'}
              stroke={filled ? GOLD : EMPTY}
              strokeWidth={2}
              style={
                filled
                  ? { filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.6))' }
                  : undefined
              }
            />
          </motion.div>
        );
      })}
    </div>
  );
}
