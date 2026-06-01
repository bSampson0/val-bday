import { useEffect } from 'react';
import { gsap } from 'gsap';

const COLORS = ['#FF6EB4', '#FFD700', '#5BC0EB', '#58D68D', '#FF3366', '#9B59B6', '#A8EDEA'];
const SHAPES = ['★', '♦', '●', '✦', '✿'];

export default function CursorSparkle() {
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let frameId;
    let moveCount = 0;
    let particleCount = 0;
    const MAX_PARTICLES = 15; // Limit max active particles

    const onMouseMove = (e) => {
      moveCount++;
      // Throttle: only spawn every 5th event (reduced from 3rd)
      if (moveCount % 5 !== 0) return;
      // Don't create if too many particles active
      if (particleCount >= MAX_PARTICLES) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) < 8) return;

      lastX = e.clientX;
      lastY = e.clientY;

      particleCount++;
      const el = document.createElement('div');
      el.className = 'cursor-particle';
      el.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.fontSize = `${Math.random() * 10 + 8}px`;
      el.style.fontWeight = 'bold';
      el.style.pointerEvents = 'none';
      el.style.position = 'fixed';
      el.style.zIndex = '9999';
      el.style.transform = 'translate(-50%, -50%)';
      el.style.willChange = 'transform, opacity';
      document.body.appendChild(el);

      gsap.to(el, {
        y: -45 - Math.random() * 30,
        x: (Math.random() - 0.5) * 40,
        opacity: 0,
        scale: 0.3,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          el.remove();
          particleCount--;
        },
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return null;
}
