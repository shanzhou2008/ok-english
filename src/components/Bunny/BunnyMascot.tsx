import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BunnyMascotProps {
  size?: 'sm' | 'md' | 'lg';
  mood?: 'happy' | 'excited' | 'thinking' | 'sleeping';
  className?: string;
}

const sizeMap = { sm: 56, md: 80, lg: 120 };

const PINK = '#FFB6C1';
const DARK = '#4A4A4A';
const GOLD = '#FFD700';
const WARM = '#FFA94D';
const CHEEK = 'rgba(255,182,193,0.5)';

export default function BunnyMascot({ size = 'md', mood = 'happy', className }: BunnyMascotProps) {
  const px = sizeMap[size];
  const s = px / 80;
  const v = (n: number) => n * s;

  const earTilt = mood === 'thinking' ? 20 : 12;
  const headTilt = mood === 'thinking' ? 10 : 0;

  const earBase: React.CSSProperties = {
    position: 'relative',
    width: v(18),
    height: v(42),
    borderRadius: '50%',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
    boxShadow: '0 2px 8px rgba(255,182,193,0.3)',
    transformOrigin: 'bottom center',
  };
  const earInner: React.CSSProperties = {
    position: 'absolute',
    top: v(8),
    left: '50%',
    transform: 'translateX(-50%)',
    width: v(10),
    height: v(28),
    borderRadius: '50%',
    background: 'linear-gradient(180deg, #FFB6C1 0%, #FF8FAB 100%)',
    opacity: 0.9,
  };
  const cheek: React.CSSProperties = {
    position: 'absolute',
    top: v(40),
    width: v(12),
    height: v(8),
    borderRadius: '50%',
    background: CHEEK,
  };

  return (
    <motion.div
      className={cn('relative', className)}
      style={{ width: px, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      animate={{ y: [0, -v(6), 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Ears */}
      <div style={{ display: 'flex', gap: v(12), marginBottom: -v(10), zIndex: 0 }}>
        <motion.div
          style={{ ...earBase, transform: `rotate(${-earTilt}deg)` }}
          animate={mood === 'excited' ? { rotate: [-earTilt, -earTilt - 5, -earTilt] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div style={earInner} />
        </motion.div>
        <motion.div
          style={{ ...earBase, transform: `rotate(${earTilt}deg)` }}
          animate={mood === 'excited' ? { rotate: [earTilt, earTilt + 5, earTilt] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div style={earInner} />
        </motion.div>
      </div>

      {/* Face */}
      <motion.div
        style={{
          position: 'relative',
          width: px,
          height: px,
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          boxShadow: '0 6px 20px rgba(255,182,193,0.25), 0 0 0 2px rgba(255,182,193,0.1)',
          zIndex: 1,
        }}
        animate={{ rotate: headTilt }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        {/* Eyes */}
        {mood === 'sleeping' ? (
          <>
            <motion.div
              style={{ position: 'absolute', top: v(26), left: v(18), width: v(14), height: v(3), background: DARK, borderRadius: v(2) }}
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              style={{ position: 'absolute', top: v(26), right: v(18), width: v(14), height: v(3), background: DARK, borderRadius: v(2) }}
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </>
        ) : (
          <>
            {/* Left eye */}
            <div style={{ position: 'absolute', top: v(24), left: v(18), width: v(14), height: v(14), borderRadius: '50%', background: DARK }}>
              <motion.div
                style={{ position: 'absolute', top: v(2), left: v(3), width: v(5), height: v(5), borderRadius: '50%', background: '#FFFFFF' }}
                animate={mood === 'excited' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              {/* Sparkle */}
              <div style={{ position: 'absolute', top: v(1), left: v(1), width: v(2), height: v(2), borderRadius: '50%', background: '#FFFFFF', opacity: 0.8 }} />
            </div>
            {/* Right eye */}
            <div style={{ position: 'absolute', top: v(24), right: v(18), width: v(14), height: v(14), borderRadius: '50%', background: DARK }}>
              <motion.div
                style={{ position: 'absolute', top: v(2), left: v(3), width: v(5), height: v(5), borderRadius: '50%', background: '#FFFFFF' }}
                animate={mood === 'excited' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <div style={{ position: 'absolute', top: v(1), left: v(1), width: v(2), height: v(2), borderRadius: '50%', background: '#FFFFFF', opacity: 0.8 }} />
            </div>
          </>
        )}

        {/* Blush cheeks */}
        <div style={{ ...cheek, left: v(6) }} />
        <div style={{ ...cheek, right: v(6) }} />

        {/* Nose (pink heart shape) */}
        <div
          style={{
            position: 'absolute',
            top: v(38),
            left: '50%',
            transform: 'translateX(-50%)',
            width: v(10),
            height: v(8),
            background: PINK,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          }}
        />

        {/* Mouth */}
        {mood === 'happy' && (
          <motion.div
            style={{ position: 'absolute', top: v(46), left: '50%', transform: 'translateX(-50%)', width: v(12), height: v(6), borderBottom: `${v(2.5)}px solid ${DARK}`, borderColor: DARK, borderStyle: 'solid', borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderRadius: `0 0 ${v(8)}px ${v(8)}px` }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        {mood === 'excited' && (
          <motion.div
            style={{ position: 'absolute', top: v(44), left: '50%', transform: 'translateX(-50%)', width: v(18), height: v(12), background: DARK, borderRadius: `0 0 ${v(10)}px ${v(10)}px` }}
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
        {(mood === 'thinking' || mood === 'sleeping') && (
          <div style={{ position: 'absolute', top: v(48), left: '50%', transform: 'translateX(-50%)', width: v(8), height: v(4), borderBottom: `${v(2)}px solid ${DARK}`, borderColor: DARK, borderStyle: 'solid', borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderRadius: `0 0 ${v(5)}px ${v(5)}px` }} />
        )}

        {/* Cute bunny teeth */}
        {(mood === 'happy' || mood === 'excited') && (
          <div style={{ position: 'absolute', top: v(52), left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: v(1) }}>
            <div style={{ width: v(4), height: v(6), background: '#FFFFFF', borderRadius: `0 0 ${v(2)}px ${v(2)}px`, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
            <div style={{ width: v(4), height: v(6), background: '#FFFFFF', borderRadius: `0 0 ${v(2)}px ${v(2)}px`, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
          </div>
        )}

        {/* Bow tie / ribbon */}
        <div style={{ position: 'absolute', top: -v(2), left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: v(1) }}>
          <div style={{ width: v(10), height: v(8), background: '#FFB6C1', borderRadius: '50%', transform: 'rotate(-25deg)' }} />
          <div style={{ width: v(6), height: v(6), background: '#FF8FAB', borderRadius: '50%' }} />
          <div style={{ width: v(10), height: v(8), background: '#FFB6C1', borderRadius: '50%', transform: 'rotate(25deg)' }} />
        </div>
      </motion.div>

      {/* Zzz for sleeping */}
      {mood === 'sleeping' && (
        <motion.div
          style={{ position: 'absolute', top: -v(6), right: -v(4), color: '#9CA3AF', fontWeight: 700, lineHeight: 1 }}
          animate={{ y: [0, -v(5), 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span style={{ fontSize: v(12) }}>z</span>
          <span style={{ fontSize: v(9) }}>z</span>
          <span style={{ fontSize: v(6) }}>z</span>
        </motion.div>
      )}

      {/* Hearts for excited */}
      {mood === 'excited' && (
        <>
          <motion.div
            style={{ position: 'absolute', top: -v(8), left: v(2), color: PINK, fontSize: v(14), lineHeight: 1 }}
            animate={{ scale: [1, 1.3, 1], y: [0, -v(3), 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >💕</motion.div>
          <motion.div
            style={{ position: 'absolute', top: v(4), right: -v(3), color: WARM, fontSize: v(11), lineHeight: 1 }}
            animate={{ scale: [1, 1.2, 1], y: [0, -v(2), 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >💕</motion.div>
        </>
      )}
    </motion.div>
  );
}