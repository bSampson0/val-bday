import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { PARTY } from '../config';
import { useGuestCount } from '../hooks/useGuestCount';
import { useGuestList } from '../hooks/useGuestList';
import { playCoin } from '../lib/sounds';

function InfoCard({ icon, title, value, subvalue, color, delay, borderClass }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: 'backOut' }}
      whileHover={{ scale: 1.03, y: -4 }}
      className={`relative p-6 md:p-8 ${borderClass}`}
      style={{
        background: 'rgba(13, 2, 31, 0.85)',
        backdropFilter: 'blur(8px)',
        cursor: 'default',
      }}
    >
      {/* Corner decorations */}
      <div className="absolute top-1 left-1 w-3 h-3" style={{ borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <div className="absolute top-1 right-1 w-3 h-3" style={{ borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      <div className="absolute bottom-1 left-1 w-3 h-3" style={{ borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <div className="absolute bottom-1 right-1 w-3 h-3" style={{ borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />

      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-pixel text-xs tracking-widest mb-3" style={{ color }}>
        {title}
      </h3>
      <p className="font-candy text-xl md:text-2xl text-white mb-1">{value}</p>
      {subvalue && (
        <p className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {subvalue}
        </p>
      )}
    </motion.div>
  );
}

function CoinRain({ active }) {
  const COINS = ['🪙', '💰', '⭐', '💎'];
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-5%',
            animation: `fall ${1 + Math.random() * 2}s ease-in ${Math.random() * 0.8}s forwards`,
          }}
        >
          {COINS[i % COINS.length]}
        </div>
      ))}
    </div>
  );
}

export default function PartyInfo() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });
  const coinRainFired = useRef(false);
  const guestCount = useGuestCount();
  const guestList = useGuestList();

  useEffect(() => {
    if (inView && !coinRainFired.current) {
      coinRainFired.current = true;
      playCoin();
    }
  }, [inView]);

  const cards = [
    {
      icon: '📅',
      title: '— WHEN —',
      value: PARTY.date,
      subvalue: PARTY.time,
      color: '#FFD700',
      borderClass: 'pixel-border-yellow',
    },
    {
      icon: '📍',
      title: '— WHERE —',
      value: PARTY.location,
      subvalue: PARTY.address,
      color: '#5BC0EB',
      borderClass: 'pixel-border-blue',
    },
    {
      icon: '🎁',
      title: '— WHAT TO KNOW —',
      value: PARTY.notes,
      subvalue: `RSVP by ${PARTY.rsvpDeadline}`,
      color: '#FF6EB4',
      borderClass: 'pixel-border',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="party-info"
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1A0533 0%, #2D1054 50%, #1A0533 100%)' }}
    >
      {/* Coin rain on enter */}
      <CoinRain active={inView} />

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg, transparent, transparent 40px, rgba(255,110,180,0.3) 40px, rgba(255,110,180,0.3) 41px
          ), repeating-linear-gradient(
            90deg, transparent, transparent 40px, rgba(255,110,180,0.3) 40px, rgba(255,110,180,0.3) 41px
          )`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* HUD header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12 flex-wrap gap-4"
        >
          <div>
            <p className="font-pixel text-xs mb-1" style={{ color: '#9B59B6' }}>
              ★ MISSION BRIEFING ★
            </p>
            <h2
              className="font-candy text-4xl md:text-5xl"
              style={{
                color: '#FFD700',
                textShadow: '0 0 15px rgba(255,215,0,0.6), 4px 4px 0 #CC9900',
              }}
            >
              Party Details
            </h2>
          </div>

          {/* Live guest counter — game HUD style */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex items-center gap-3 px-5 py-3"
            style={{
              background: 'rgba(13,2,31,0.9)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 15px rgba(255,215,0,0.4)',
            }}
          >
            <span className="text-2xl coin-shine">🪙</span>
            <div>
              <div className="font-pixel text-xs" style={{ color: '#9B59B6' }}>PLAYERS JOINED</div>
              <motion.div
                key={guestCount}
                initial={{ scale: 1.5, color: '#FFD700' }}
                animate={{ scale: 1 }}
                className="font-pixel text-2xl neon-text-yellow"
              >
                {String(guestCount).padStart(2, '0')}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Info cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <InfoCard key={card.title} {...card} delay={i * 0.15} />
          ))}
        </div>

        {/* RSVP roster */}
        {guestList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 p-6 md:p-8"
            style={{
              background: 'rgba(13, 2, 31, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '2px solid #9B59B6',
              boxShadow: '0 0 20px rgba(155,89,182,0.3)',
            }}
          >
            <p className="font-pixel text-xs tracking-widest mb-6" style={{ color: '#9B59B6' }}>
              ★ PARTY ROSTER ★
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {guestList.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <span className="font-pixel text-xs shrink-0" style={{ color: '#FFD700' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-body text-sm text-white truncate">{name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="font-pixel text-xs mb-6 tracking-wide" style={{ color: '#A8EDEA' }}>
            READY TO JOIN THE RACE?
          </p>
          <motion.button
            onClick={() => document.getElementById('checkin')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="font-pixel text-sm px-10 py-4"
            style={{
              background: '#FF6EB4',
              color: '#1A0533',
              boxShadow: '0 6px 0 #C0569A, 0 0 20px #FF6EB4, 0 0 50px rgba(255,110,180,0.5)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ▶ CHECK IN NOW
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
