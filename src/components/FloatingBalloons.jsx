import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { playPop } from '../lib/sounds';

const BALLOON_COLORS = [
  { fill: '#FF6EB4', shine: 'rgba(255,255,255,0.5)', shadow: '#C0569A' },
  { fill: '#FFD700', shine: 'rgba(255,255,255,0.5)', shadow: '#CC9900' },
  { fill: '#5BC0EB', shine: 'rgba(255,255,255,0.5)', shadow: '#2E88B4' },
  { fill: '#58D68D', shine: 'rgba(255,255,255,0.5)', shadow: '#2E9E5E' },
  { fill: '#FF3366', shine: 'rgba(255,255,255,0.5)', shadow: '#CC0044' },
  { fill: '#9B59B6', shine: 'rgba(255,255,255,0.5)', shadow: '#6C3483' },
  { fill: '#A8EDEA', shine: 'rgba(255,255,255,0.5)', shadow: '#5BC0EB' },
];

function BalloonSVG({ color }) {
  return (
    <svg width="50" height="80" viewBox="0 0 50 80" fill="none">
      <ellipse cx="25" cy="26" rx="22" ry="24" fill={color.fill} />
      <ellipse cx="17" cy="15" rx="7" ry="9" fill={color.shine} />
      <ellipse cx="25" cy="50" rx="4" ry="3" fill={color.shadow} />
      <path d="M25 53 Q19 62 25 72" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Knot */}
      <path d="M22 49 Q25 52 28 49" stroke={color.shadow} strokeWidth="2" fill="none" />
    </svg>
  );
}

function BurstParticle({ x, y, color }) {
  return (
    <div
      className="absolute pointer-events-none text-lg"
      style={{ left: x, top: y, color, zIndex: 100 }}
    >
      ✨
    </div>
  );
}

const INIT_BALLOONS = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  color: BALLOON_COLORS[i % BALLOON_COLORS.length],
  left: `${8 + i * 10}%`,
  bottom: `${-(i % 3) * 10}%`,
  delay: `${i * 0.4}s`,
  duration: `${5 + i * 0.7}s`,
  popped: false,
}));

export default function FloatingBalloons() {
  const [balloons, setBalloons] = useState(INIT_BALLOONS);
  const [bursts, setBursts] = useState([]);
  const refs = useRef({});

  const popBalloon = (id, e) => {
    const el = refs.current[id];
    if (!el) return;
    playPop();

    const rect = el.getBoundingClientRect();
    const burstId = Date.now();
    setBursts((prev) => [
      ...prev,
      { id: burstId, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    ]);
    setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== burstId)), 800);

    gsap.to(el, {
      scale: 1.4,
      duration: 0.06,
      onComplete: () => {
        gsap.to(el, {
          scale: 0,
          opacity: 0,
          duration: 0.12,
          onComplete: () => {
            setBalloons((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
          },
        });
      },
    });
  };

  return (
    <>
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
        {balloons
          .filter((b) => !b.popped)
          .map((balloon) => (
            <div
              key={balloon.id}
              id={`balloon-${balloon.id}`}
              ref={(el) => { refs.current[balloon.id] = el; }}
              onClick={(e) => popBalloon(balloon.id, e)}
              className="absolute cursor-pointer pointer-events-auto"
              style={{
                left: balloon.left,
                bottom: balloon.bottom,
                animation: `rise ${balloon.duration} ease-in ${balloon.delay} infinite`,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            >
              <BalloonSVG color={balloon.color} />
            </div>
          ))}
      </div>

      {/* Pop burst particles — fixed positioned */}
      {bursts.map((burst) => (
        <div key={burst.id} className="pointer-events-none" style={{ position: 'fixed', left: burst.x, top: burst.y, zIndex: 9998 }}>
          {['✨', '💥', '⭐', '🌟'].map((emoji, i) => {
            const angle = (i / 4) * Math.PI * 2;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  fontSize: '20px',
                  transform: `translate(${Math.cos(angle) * 30}px, ${Math.sin(angle) * 30}px)`,
                  animation: 'fall 0.6s ease-out forwards',
                  opacity: 0,
                }}
              >
                {emoji}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
