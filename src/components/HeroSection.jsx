import { useRef } from 'react';
import { motion } from 'framer-motion';
import CandyClouds from './CandyClouds';
import FloatingBalloons from './FloatingBalloons';
import FloatingParticles from './FloatingParticles';
import CountdownTimer from './CountdownTimer';
import { PARTY } from '../config';

const TITLE = `Welcome to ${PARTY.name}'s`;
const SUBTITLE = 'Birthday Adventure!';

function LetterReveal({ text, className, delay = 0, color }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotate: (Math.random() - 0.5) * 20 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.04,
            ease: 'backOut',
          }}
          style={{ display: 'inline-block', color, whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

const SCROLL_INDICATOR_VARIANTS = {
  animate: {
    y: [0, 12, 0],
    transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
  },
};

export default function HeroSection({ onScrollToInfo }) {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0D021F 0%, #1A0533 40%, #2D1054 100%)' }}
    >

      {/* Candy clouds */}
      <CandyClouds />

      {/* Floating candy particles */}
      <FloatingParticles count={20} />

      {/* Balloons */}
      <FloatingBalloons />

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 pt-24 pb-32" style={{ minHeight: '100vh' }}>
        {/* Vanellope car */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'backOut' }}
          className="mb-6 animate-float"
          style={{ filter: 'drop-shadow(0 0 24px rgba(255,110,180,0.8))' }}
        >
          <img
            src="/assets/venelope-car.png"
            alt="Vanellope's candy kart"
            className="w-48 md:w-64 lg:w-80 object-contain"
          />
        </motion.div>

        {/* Title */}
        <h1 className="font-candy mb-2 leading-tight">
          <LetterReveal
            text={TITLE}
            className="block text-3xl md:text-5xl lg:text-6xl"
            delay={0.3}
            color="#FFD700"
          />
          <LetterReveal
            text={SUBTITLE}
            className="block text-4xl md:text-6xl lg:text-7xl mt-2"
            delay={0.7}
            color="#FF6EB4"
          />
        </h1>

        {/* Subtitle badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5, ease: 'backOut' }}
          className="mt-6 px-6 py-3 font-pixel text-xs tracking-wide"
          style={{
            background: 'rgba(13,2,31,0.7)',
            border: '2px solid #FF6EB4',
            boxShadow: '0 0 15px rgba(255,110,180,0.5)',
            color: '#A8EDEA',
          }}
        >
          🎮 A SUGAR RUSH RACING ADVENTURE 🎮
        </motion.div>

        {/* Countdown timer */}
        <div className="mt-8 mb-2">
          <CountdownTimer />
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <motion.button
            onClick={onScrollToInfo}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            className="font-pixel text-xs px-8 py-4 tracking-wide"
            style={{
              background: '#FF6EB4',
              color: '#1A0533',
              boxShadow: '0 6px 0 #C0569A, 0 0 20px #FF6EB4, 0 0 40px rgba(255,110,180,0.4)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            🎂 PARTY INFO
          </motion.button>

          <motion.button
            onClick={() => document.getElementById('checkin')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            className="font-pixel text-xs px-8 py-4 tracking-wide"
            style={{
              background: '#FFD700',
              color: '#1A0533',
              boxShadow: '0 6px 0 #CC9900, 0 0 20px #FFD700, 0 0 40px rgba(255,215,0,0.4)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ▶ CHECK IN
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={SCROLL_INDICATOR_VARIANTS}
          animate="animate"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-pixel text-xs" style={{ color: '#9B59B6' }}>SCROLL</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="#FF6EB4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
