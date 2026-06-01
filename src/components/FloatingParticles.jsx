import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CANDY_ICONS = ['🍭', '🍬', '🍫', '⭐', '💎', '🌟', '🍡', '🎀', '✨', '🎠'];
const COLORS = ['#FF6EB4', '#FFD700', '#5BC0EB', '#58D68D', '#FF3366', '#9B59B6'];

function createParticle(container) {
  const el = document.createElement('div');
  el.textContent = CANDY_ICONS[Math.floor(Math.random() * CANDY_ICONS.length)];
  el.style.position = 'absolute';
  el.style.fontSize = `${Math.random() * 16 + 12}px`;
  el.style.left = `${Math.random() * 100}%`;
  el.style.top = '-5%';
  el.style.pointerEvents = 'none';
  el.style.userSelect = 'none';
  el.style.zIndex = '5';
  el.style.opacity = '0';
  el.style.willChange = 'transform, opacity';
  container.appendChild(el);

  const duration = 5 + Math.random() * 6;
  const drift = (Math.random() - 0.5) * 100;

  gsap.fromTo(
    el,
    { y: 0, x: 0, rotation: 0, opacity: 0, scale: 0.5 },
    {
      y: `${window.innerHeight + 100}px`,
      x: drift,
      rotation: (Math.random() - 0.5) * 540,
      opacity: 0.7,
      scale: 1,
      duration,
      ease: 'none',
      delay: Math.random() * 3,
      onComplete: () => {
        el.remove();
        createParticle(container);
      },
    }
  );
}

export default function FloatingParticles({ count = 12 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => createParticle(container), i * 300);
    }
  }, [count]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
    />
  );
}
