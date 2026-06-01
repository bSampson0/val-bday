import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import HeroSection from './components/HeroSection';
import PartyInfo from './components/PartyInfo';
import CheckInScreen from './components/CheckInScreen';
import CursorSparkle from './components/CursorSparkle';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const infoRef = useRef(null);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  const scrollToInfo = useCallback(() => {
    infoRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: '#1A0533' }}>
      {/* Global cursor sparkle effect */}
      <CursorSparkle />

      {/* Loading screen overlay */}
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}
      </AnimatePresence>

      {/* Main content — renders behind loading screen, appears when loaded */}
      <AnimatePresence>
        {loaded && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Section 1: Hero */}
            <HeroSection onScrollToInfo={scrollToInfo} />

            {/* Section 2: Party Info */}
            <div ref={infoRef}>
              <PartyInfo />
            </div>

            {/* Section 3: Check-in */}
            <CheckInScreen />

            {/* Footer */}
            <footer
              className="py-8 px-4 text-center"
              style={{ background: '#0D021F', borderTop: '2px solid #2D1054' }}
            >
              <p className="font-pixel text-xs tracking-widest mb-2" style={{ color: '#9B59B6' }}>
                🎮 SUGAR RUSH RACING CO. 🎮
              </p>
              <p className="font-pixel" style={{ color: '#2D1054', fontSize: '0.45rem' }}>
                MADE WITH 🍭 FOR VALERIE'S BIRTHDAY
              </p>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
