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

    const onMouseMove = (e) => {
      moveCount++;
      // Throttle: only spawn every 3rd event
      if (moveCount % 3 !== 0) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) < 8) return;

      lastX = e.clientX;
      lastY = e.clientY;

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
      document.body.appendChild(el);

      gsap.to(el, {
        y: -45 - Math.random() * 30,
        x: (Math.random() - 0.5) * 40,
        opacity: 0,
        scale: 0.3,
        duration: 0.7 + Math.random() * 0.3,
        ease: 'power2.out',
        onComplete: () => el.remove(),
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
