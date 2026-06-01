import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { playStartup } from '../lib/sounds';

const MESSAGES = [
  'Gathering candy ingredients...',
  'Building Sugar Rush track...',
  'Loading Vanellope\'s kart...',
  'Sprinkling magic pixels...',
  'Get ready to race!',
];

const CANDY_ICONS = ['🍭', '🍬', '🍫', '⭐', '💎', '🌟', '🎀', '✨'];

export default function LoadingScreen({ onComplete }) {
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [candyIcons, setCandyIcons] = useState([]);

  useEffect(() => {
    // Start retro startup sound after short delay (needs user gesture on some browsers)
    const soundTimer = setTimeout(() => {
      try { playStartup(); } catch {}
    }, 300);

    const tl = gsap.timeline();
    tl.to({}, {
      duration: 3.5,
      ease: 'none',
      onUpdate() {
        const p = Math.round(this.progress() * 100);
        setProgress(p);

        // Update message
        const mIdx = Math.min(Math.floor(this.progress() * MESSAGES.length), MESSAGES.length - 1);
        setMsgIndex(mIdx);

        // Add candy icon at each 20% mark
        const iconCount = Math.floor(this.progress() * 5);
        setCandyIcons((prev) => {
          if (prev.length < iconCount) {
            return [
              ...prev,
              { id: prev.length, icon: CANDY_ICONS[prev.length % CANDY_ICONS.length] },
            ];
          }
          return prev;
        });
      },
      onComplete: () => {
        setTimeout(onComplete, 400);
      },
    });

    return () => {
      tl.kill();
      clearTimeout(soundTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center scanlines crt-vignette overflow-hidden pt-12"
      style={{
        background: 'radial-gradient(ellipse at center, #2D1054 0%, #1A0533 50%, #0D021F 100%)',
      }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.1,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Arcade cabinet header */}
      <div className="relative z-10 text-center mb-8">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'backOut' }}
          className="font-pixel neon-text-yellow text-xs md:text-sm mb-6 tracking-widest"
        >
          ★ BNICE ARCADE PRESENTS ★
        </motion.div>

        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'backOut' }}
          className="font-pixel text-2xl md:text-4xl mb-2 leading-relaxed"
          style={{
            color: '#FF6EB4',
            textShadow: '0 0 10px #FF6EB4, 0 0 30px #FF6EB4, 0 0 60px rgba(255,110,180,0.5), 4px 4px 0 #C0569A',
          }}
        >
          SUGAR RUSH
        </motion.h1>
        <motion.h2
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'backOut' }}
          className="font-pixel text-sm md:text-xl shimmer-text"
        >
          BIRTHDAY ADVENTURE
        </motion.h2>
      </div>

      {/* INSERT COIN blinking */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-pixel text-xs neon-text-yellow animate-blink mb-10 tracking-widest"
      >
        ► INSERT COIN ◄
      </motion.div>

      {/* Loading section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="font-pixel text-center mb-4 text-xs tracking-wide"
            style={{ color: '#A8EDEA' }}
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar container */}
        <div
          className="relative w-full h-10 rounded-none mb-3 overflow-hidden"
          style={{
            background: '#0D021F',
            border: '3px solid #FF6EB4',
            boxShadow: '0 0 0 3px #1A0533, 0 0 0 6px #FF6EB4, 0 0 20px rgba(255,110,180,0.4)',
          }}
        >
          {/* Fill bar */}
          <motion.div
            ref={progressRef}
            className="h-full flex items-center"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FF3366, #FF6EB4, #FFD700)',
              boxShadow: '0 0 15px rgba(255,110,180,0.8)',
              transition: 'width 0.1s linear',
            }}
          >
            {/* Candy icons inside bar */}
            {candyIcons.map((item) => (
              <span
                key={item.id}
                className="text-lg ml-1 flex-shrink-0"
                style={{ filter: 'drop-shadow(0 0 4px white)' }}
              >
                {item.icon}
              </span>
            ))}
          </motion.div>

          {/* Progress percentage */}
          <div
            className="absolute inset-0 flex items-center justify-center font-pixel text-xs pointer-events-none"
            style={{ color: progress > 50 ? '#1A0533' : '#FF6EB4', mixBlendMode: 'difference' }}
          >
            {progress}%
          </div>
        </div>

        {/* LOADING text */}
        <p
          className="font-pixel text-center text-xs tracking-widest flicker"
          style={{ color: '#9B59B6' }}
        >
          LOADING BIRTHDAY ADVENTURE...
        </p>
      </motion.div>

      {/* Bottom decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 font-pixel text-xs tracking-widest"
        style={{ color: '#2D1054' }}
      >
        © VANELLOPE VON SCHWEETZ RACING CO.
      </motion.div>
    </motion.div>
  );
}
