import React from 'react';

const clouds = [
  { id: 1, top: '8%', scale: 1, duration: '28s', delay: '0s', opacity: 0.9 },
  { id: 2, top: '18%', scale: 0.65, duration: '40s', delay: '-12s', opacity: 0.7 },
  { id: 3, top: '12%', scale: 1.2, duration: '22s', delay: '-6s', opacity: 0.85 },
  { id: 4, top: '25%', scale: 0.8, duration: '35s', delay: '-20s', opacity: 0.6 },
  { id: 5, top: '5%', scale: 0.5, duration: '50s', delay: '-30s', opacity: 0.5 },
];

function CloudShape({ color = '#fff' }) {
  return (
    <svg width="160" height="80" viewBox="0 0 160 80" fill="none">
      <ellipse cx="80" cy="55" rx="70" ry="22" fill={color} />
      <ellipse cx="55" cy="45" rx="38" ry="28" fill={color} />
      <ellipse cx="95" cy="40" rx="35" ry="26" fill={color} />
      <ellipse cx="75" cy="35" rx="28" ry="22" fill={color} />
    </svg>
  );
}

const CLOUD_COLORS = [
  'rgba(255,182,215,0.85)',
  'rgba(182,215,255,0.8)',
  'rgba(255,240,182,0.8)',
  'rgba(182,255,215,0.75)',
  'rgba(255,182,255,0.8)',
];

export default function CandyClouds() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {clouds.map((cloud, i) => (
        <div
          key={cloud.id}
          className="absolute"
          style={{
            top: cloud.top,
            left: '-20vw',
            transform: `scale(${cloud.scale})`,
            opacity: cloud.opacity,
            animation: `driftRight ${cloud.duration} linear ${cloud.delay} infinite`,
          }}
        >
          <CloudShape color={CLOUD_COLORS[i % CLOUD_COLORS.length]} />
        </div>
      ))}
    </div>
  );
}
