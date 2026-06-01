import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useCheckIn } from '../hooks/useCheckIn';
import { playCoin, playLevelUp } from '../lib/sounds';
import CoinBurst from './CoinBurst';
import ConfettiOverlay from './ConfettiOverlay';

const SHAKE = {
  x: [0, -10, 10, -10, 10, -6, 6, -3, 3, 0],
  transition: { duration: 0.4, ease: 'easeInOut' },
};

function SuccessScreen({ name, guestNumber, onReset }) {
  const MESSAGES = [
    `🏎️  PLAYER ${String(guestNumber || '?').padStart(2, '0')} HAS JOINED THE RACE!`,
    `✨  WELCOME, ${name.toUpperCase()}!`,
    `🍭  GET READY TO RACE!`,
    `🎉  LET THE ADVENTURE BEGIN!`,
  ];

  const tickerText = MESSAGES.join('   ★   ');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: 'backOut' }}
      className="flex flex-col items-center justify-center text-center px-6 py-12"
    >
      {/* Character */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="text-8xl mb-6 animate-bounce-slow"
        style={{ filter: 'drop-shadow(0 0 25px rgba(255,110,180,0.9))' }}
      >
        🏆
      </motion.div>

      {/* Player number badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 10 }}
        className="font-pixel text-xs px-5 py-2 mb-5 tracking-widest"
        style={{
          background: '#FFD700',
          color: '#1A0533',
          boxShadow: '0 4px 0 #CC9900, 0 0 20px rgba(255,215,0,0.6)',
        }}
      >
        PLAYER {String(guestNumber || '?').padStart(2, '0')}
      </motion.div>

      {/* Welcome message */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-candy text-4xl md:text-6xl mb-3"
        style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255,215,0,0.7), 4px 4px 0 #CC9900' }}
      >
        Welcome,
      </motion.h2>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-candy text-5xl md:text-7xl mb-8"
        style={{ color: '#FF6EB4', textShadow: '0 0 20px rgba(255,110,180,0.7), 4px 4px 0 #C0569A' }}
      >
        {name}!
      </motion.h3>

      {/* Scrolling ticker */}
      <div
        className="w-full overflow-hidden py-3 mb-8"
        style={{
          background: 'rgba(13,2,31,0.9)',
          border: '2px solid #FF6EB4',
          boxShadow: '0 0 15px rgba(255,110,180,0.4)',
        }}
      >
        <div
          className="font-pixel text-xs whitespace-nowrap"
          style={{
            color: '#A8EDEA',
            animation: 'marquee 10s linear infinite',
            display: 'inline-block',
          }}
        >
          {tickerText}&nbsp;&nbsp;&nbsp;{tickerText}
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-3 gap-4 mb-10 w-full max-w-xs"
      >
        {[
          { label: 'PLAYER', value: `#${String(guestNumber || '?').padStart(2, '0')}` },
          { label: 'STATUS', value: 'READY' },
          { label: 'RANK', value: 'RACER' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center p-3"
            style={{
              background: 'rgba(13,2,31,0.8)',
              border: '1px solid rgba(255,110,180,0.4)',
            }}
          >
            <div className="font-pixel text-xs mb-1" style={{ color: '#9B59B6', fontSize: '0.45rem' }}>
              {stat.label}
            </div>
            <div className="font-pixel text-sm" style={{ color: '#FF6EB4' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Check in another button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onReset}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="font-pixel text-xs px-8 py-3"
        style={{
          background: 'transparent',
          color: '#9B59B6',
          border: '2px solid #9B59B6',
          boxShadow: '0 0 10px rgba(155,89,182,0.3)',
          cursor: 'pointer',
        }}
      >
        ↩ CHECK IN ANOTHER PLAYER
      </motion.button>
    </motion.div>
  );
}

export default function CheckInScreen() {
  const [name, setName] = useState('');
  const [shake, setShake] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const { checkIn, status, guestNumber, error, reset } = useCheckIn();
  const buttonRef = useRef(null);
  const coinBurstRef = useRef(null);
  const confettiRef = useRef(null);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  // Only load video when section is visible
  useEffect(() => {
    if (isInView && videoRef.current && !videoReady) {
      videoRef.current.play().catch(() => {});
      setVideoReady(true);
    }
  }, [isInView, videoReady]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    playCoin();
    coinBurstRef.current?.burst();
    await checkIn(name.trim());
    playLevelUp();
    confettiRef.current?.fire();
  };

  return (
    <section
      id="checkin"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated video background - lazy loaded */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ opacity: 0.25, willChange: 'opacity' }}
          onError={(e) => { e.target.style.display = 'none'; }}
          preload="none"
        >
          <source src="/assets/candy-world.mp4" type="video/mp4" />
        </video>
        {/* Fallback gradient - simpler and faster */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1A0533 0%, #2D1054 50%, #1A0533 100%)',
          }}
        />
      </div>

      {/* Dark overlay - simplified, no blur */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(13,2,31,0.7)' }}
      />

      {/* Coin burst layer */}
      <CoinBurst ref={coinBurstRef} originRef={buttonRef} />
      <ConfettiOverlay ref={confettiRef} />

      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-16">
        {/* Header (static) */}
        <div className="text-center mb-10">
          <p className="font-pixel text-xs tracking-widest mb-3" style={{ color: '#9B59B6' }}>
            ★ PLAYER REGISTRATION ★
          </p>
          <h2
            className="font-candy text-5xl md:text-6xl"
            style={{
              color: '#FF6EB4',
              textShadow: '0 0 20px rgba(255,110,180,0.7), 4px 4px 0 #C0569A',
            }}
          >
            Check In!
          </h2>
        </motion.div>

        {/* Main card (static) */}
        <div
          className="relative p-8 scanlines"
          style={{
            background: 'rgba(13,2,31,0.92)',
            border: '3px solid #FF6EB4',
            boxShadow: '0 0 0 3px #1A0533, 0 0 0 6px #FF6EB4, 0 0 40px rgba(255,110,180,0.4)',
          }}
        >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <SuccessScreen
                key="success"
                name={name}
                guestNumber={guestNumber}
                onReset={() => { reset(); setName(''); }}
              />
              ) : (
              <div key="form">
                <form onSubmit={handleSubmit}>
                  {/* Input label */}
                  <label className="block font-pixel text-xs mb-3 tracking-wide" style={{ color: '#A8EDEA' }}>
                    ENTER YOUR NAME, PLAYER 1:
                  </label>

                  {/* Input field (static, simple visual feedback on empty submit) */}
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name here..."
                      maxLength={30}
                      disabled={status === 'submitting'}
                      className="w-full px-4 py-4 font-candy text-xl outline-none mb-6 disabled:opacity-60"
                      style={{
                        background: '#0D021F',
                        color: '#fff',
                        border: '3px solid ' + (shake ? '#FF3366' : '#FF6EB4'),
                        boxShadow: shake
                          ? '0 0 0 3px rgba(255,51,102,0.15), inset 0 0 10px rgba(255,110,180,0.05)'
                          : '0 0 15px rgba(255,110,180,0.3), inset 0 0 10px rgba(255,110,180,0.05)',
                        caretColor: '#FF6EB4',
                      }}
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 25px rgba(255,110,180,0.6), inset 0 0 15px rgba(255,110,180,0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = shake
                          ? '0 0 0 3px rgba(255,51,102,0.15), inset 0 0 10px rgba(255,110,180,0.05)'
                          : '0 0 15px rgba(255,110,180,0.3), inset 0 0 10px rgba(255,110,180,0.05)';
                      }}
                    />
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="font-pixel text-xs mb-4 text-center"
                        style={{ color: '#FF3366' }}
                      >
                        ⚠ {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* PRESS START button */}
                  <button
                    ref={buttonRef}
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full font-pixel py-5 text-sm tracking-widest disabled:opacity-70 disabled:cursor-not-allowed transform transition-transform duration-150 hover:scale-105 active:scale-95"
                    style={{
                      background: status === 'submitting' ? '#9B59B6' : 'linear-gradient(135deg, #FF3366, #FF6EB4)',
                      color: '#fff',
                      border: 'none',
                      cursor: status === 'submitting' ? 'wait' : 'pointer',
                      boxShadow: status !== 'submitting'
                        ? '0 6px 0 #C0569A, 0 0 20px #FF6EB4, 0 0 50px rgba(255,110,180,0.5)'
                        : 'none',
                      textShadow: '0 0 10px rgba(255,255,255,0.5)',
                    }}
                  >
                    {status === 'submitting' ? '⏳ LOADING...' : '▶ PRESS START ◀'}
                  </button>
                </form>

                {/* Hint */}
                <p
                  className="font-pixel text-center mt-5 tracking-wide"
                  style={{ color: 'rgba(155,89,182,0.6)', fontSize: '0.5rem' }}
                >
                  PRESS START TO JOIN THE ADVENTURE!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Decorative candy strip (static) */}
        <div className="flex justify-center gap-3 mt-6">
          {['🍭', '🍬', '🍫', '🍡', '🍭', '🍬', '🍫'].map((c, i) => (
            <span key={i} className="text-xl">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
