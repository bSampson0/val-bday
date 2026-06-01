import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';

function CoinSVG({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="13" fill="#FFD700" stroke="#CC9900" strokeWidth="2" />
      <circle cx="14" cy="14" r="10" fill="#FFEC6E" />
      <circle cx="14" cy="14" r="7" fill="#FFD700" />
      <text x="14" y="18" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#AA7700" fontFamily="Arial">$</text>
    </svg>
  );
}

const CoinBurst = forwardRef(function CoinBurst({ originRef }, ref) {
  const coinRefs = useRef([]);
  const containerRef = useRef(null);
  const COUNT = 10;

  useImperativeHandle(ref, () => ({
    burst() {
      if (!originRef?.current || !containerRef.current) return;
      const origin = originRef.current.getBoundingClientRect();
      const container = containerRef.current.getBoundingClientRect();
      const cx = origin.left + origin.width / 2 - container.left;
      const cy = origin.top + origin.height / 2 - container.top;

      coinRefs.current.forEach((coin, i) => {
        if (!coin) return;
        const angle = (i / COUNT) * Math.PI * 2;
        const dist = 110 + Math.random() * 60;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;

        gsap.set(coin, { x: cx, y: cy, opacity: 0, scale: 0 });
        gsap.to(coin, {
          x: cx + tx,
          y: cy + ty,
          opacity: 1,
          scale: 1 + Math.random() * 0.4,
          duration: 0.15,
          ease: 'power3.out',
          delay: Math.random() * 0.05,
          onComplete: () => {
            gsap.to(coin, {
              y: cy + ty + 60,
              opacity: 0,
              duration: 0.5,
              ease: 'power1.in',
              delay: 0.1,
            });
          },
        });
      });
    },
  }));

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 200 }}>
      {Array.from({ length: COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => { coinRefs.current[i] = el; }}
          className="absolute coin-shine"
          style={{ opacity: 0, top: 0, left: 0 }}
        >
          <CoinSVG size={20 + Math.floor(Math.random() * 12)} />
        </div>
      ))}
    </div>
  );
});

export default CoinBurst;
