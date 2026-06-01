import { motion } from 'framer-motion';
import { playClick } from '../lib/sounds';

export default function PixelButton({
  children,
  onClick,
  variant = 'pink',
  size = 'md',
  className = '',
  bounce = false,
  disabled = false,
  type = 'button',
}) {
  const colors = {
    pink: {
      bg: 'bg-candy-pink hover:bg-pink-400',
      shadow: '0 6px 0 #C0569A',
      glow: '0 0 20px #FF6EB4, 0 0 40px rgba(255,110,180,0.4)',
      text: 'text-arcade-dark',
    },
    yellow: {
      bg: 'bg-candy-yellow hover:bg-yellow-300',
      shadow: '0 6px 0 #CC9900',
      glow: '0 0 20px #FFD700, 0 0 40px rgba(255,215,0,0.4)',
      text: 'text-arcade-dark',
    },
    green: {
      bg: 'bg-candy-green hover:bg-green-400',
      shadow: '0 6px 0 #2E9E5E',
      glow: '0 0 20px #58D68D, 0 0 40px rgba(88,214,141,0.4)',
      text: 'text-arcade-dark',
    },
    blue: {
      bg: 'bg-candy-blue hover:bg-blue-400',
      shadow: '0 6px 0 #2E88B4',
      glow: '0 0 20px #5BC0EB, 0 0 40px rgba(91,192,235,0.4)',
      text: 'text-arcade-dark',
    },
  };

  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
    xl: 'text-lg px-10 py-5',
  };

  const c = colors[variant] || colors.pink;

  return (
    <motion.button
      type={type}
      onClick={() => {
        if (!disabled) {
          playClick();
          onClick?.();
        }
      }}
      disabled={disabled}
      animate={bounce ? { y: [0, -6, 0] } : {}}
      transition={bounce ? { repeat: Infinity, duration: 1.2, ease: 'easeInOut' } : {}}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.94, y: 4 } : {}}
      style={{
        boxShadow: disabled ? 'none' : `${c.shadow}, ${c.glow}`,
        fontFamily: '"Press Start 2P", monospace',
        imageRendering: 'pixelated',
        letterSpacing: '0.05em',
      }}
      className={`
        ${c.bg} ${c.text} ${sizes[size]}
        font-pixel rounded-none cursor-pointer
        border-0 outline-none relative
        transition-colors duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
