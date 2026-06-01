import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PARTY } from '../config';

function getTimeLeft(targetDate) {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    done: diff === 0,
  };
}

// Animates a single character slot — slides out top, enters from bottom on change
function Digit({ value, color }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        height: '1.15em',
        width: '0.75ch',
        verticalAlign: 'bottom',
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: '-110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '110%', opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TimeUnit({ value, label, color, glowColor }) {
  const str = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Number card */}
      <div
        style={{
          background: 'rgba(13, 2, 31, 0.92)',
          border: `2px solid ${glowColor}`,
          boxShadow: `0 0 12px ${glowColor}55, 0 0 30px ${glowColor}22, inset 0 0 12px ${glowColor}0D`,
          padding: '0.6em 0.8em',
          minWidth: '3.2em',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Horizontal divider line — classic flip-clock detail */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: '1px',
            background: `${glowColor}44`,
            pointerEvents: 'none',
          }}
        />
        <span
          className="font-pixel"
          style={{
            fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
            color,
            textShadow: `0 0 8px ${color}CC, 0 0 20px ${color}66`,
            display: 'inline-flex',
            letterSpacing: '0.05em',
          }}
        >
          <Digit value={str[0]} color={color} />
          <Digit value={str[1]} color={color} />
        </span>
      </div>

      {/* Label */}
      <span
        className="font-pixel tracking-widest"
        style={{ fontSize: '0.5rem', color: glowColor, opacity: 0.85 }}
      >
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <span
      className="font-pixel animate-blink"
      style={{
        fontSize: 'clamp(1.2rem, 4vw, 2rem)',
        color: '#9B59B6',
        alignSelf: 'flex-start',
        marginTop: '0.3em',
        lineHeight: 1,
        opacity: 0.7,
      }}
    >
      :
    </span>
  );
}

const UNITS = [
  { key: 'days',    label: 'DAYS', color: '#FF6EB4', glow: '#FF6EB4' },
  { key: 'hours',   label: 'HRS',  color: '#FFD700', glow: '#FFD700' },
  { key: 'minutes', label: 'MIN',  color: '#5BC0EB', glow: '#5BC0EB' },
  { key: 'seconds', label: 'SEC',  color: '#58D68D', glow: '#58D68D' },
];

export default function CountdownTimer() {
  const [time, setTime] = useState(() => getTimeLeft(PARTY.partyDate));
  const firedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      const next = getTimeLeft(PARTY.partyDate);
      setTime(next);
      if (next.done && !firedRef.current) {
        firedRef.current = true;
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (time.done) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-3 py-4"
      >
        <div
          className="font-pixel text-sm md:text-lg px-8 py-4 animate-pulse-glow tracking-widest text-center"
          style={{
            color: '#FFD700',
            border: '2px solid #FFD700',
            background: 'rgba(13,2,31,0.9)',
            textShadow: '0 0 15px #FFD700',
          }}
        >
          🎉 PARTY IS HAPPENING NOW! 🎉
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3, duration: 0.6 }}
      className="flex flex-col items-center gap-4"
    >
      {/* Header */}
      <p
        className="font-pixel tracking-widest"
        style={{ fontSize: '0.55rem', color: '#A8EDEA', opacity: 0.8 }}
      >
        ★ PARTY STARTS IN ★
      </p>

      {/* Digit row */}
      <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
        {UNITS.map((unit, i) => (
          <div key={unit.key} className="flex items-center gap-2 md:gap-3">
            <TimeUnit
              value={time[unit.key]}
              label={unit.label}
              color={unit.color}
              glowColor={unit.glow}
            />
            {i < UNITS.length - 1 && <Colon />}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
