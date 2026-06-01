import { useEffect, forwardRef, useImperativeHandle } from 'react';
import confetti from 'canvas-confetti';

const COLORS = ['#FF6EB4', '#FFD700', '#5BC0EB', '#58D68D', '#FF3366', '#9B59B6', '#A8EDEA', '#FF8C00'];

const ConfettiOverlay = forwardRef(function ConfettiOverlay(_, ref) {
  useImperativeHandle(ref, () => ({
    fire(origin = { x: 0.5, y: 0.6 }) {
      // Big center burst
      confetti({
        particleCount: 160,
        spread: 100,
        origin,
        colors: COLORS,
        shapes: ['circle', 'square'],
        scalar: 1.3,
        gravity: 0.8,
        ticks: 300,
      });

      // Side cannons
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: COLORS,
          scalar: 1.1,
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: COLORS,
          scalar: 1.1,
        });
      }, 200);

      // Sustained stream
      const end = Date.now() + 2500;
      const frame = () => {
        confetti({ particleCount: 4, angle: 60, spread: 50, origin: { x: 0 }, colors: COLORS });
        confetti({ particleCount: 4, angle: 120, spread: 50, origin: { x: 1 }, colors: COLORS });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      setTimeout(frame, 400);
    },
  }));

  return null;
});

export default ConfettiOverlay;
