/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        candy: ['"Fredoka One"', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        candy: {
          pink: '#FF6EB4',
          yellow: '#FFD700',
          blue: '#5BC0EB',
          green: '#58D68D',
          red: '#FF3366',
          purple: '#9B59B6',
          mint: '#A8EDEA',
        },
        arcade: {
          dark: '#1A0533',
          mid: '#2D1054',
          deep: '#0D021F',
          glow: '#FF00FF',
          gold: '#FFD700',
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'drift-right': 'driftRight 30s linear infinite',
        'drift-right-slow': 'driftRight 45s linear infinite',
        blink: 'blink 1s step-end infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'marquee': 'marquee 12s linear infinite',
        'fall': 'fall 6s linear infinite',
        'rise': 'rise 8s ease-in infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        driftRight: {
          '0%': { transform: 'translateX(-20vw)' },
          '100%': { transform: 'translateX(110vw)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px #FF6EB4, 0 0 20px #FF6EB4, 0 0 40px rgba(255,110,180,0.4)' },
          '50%': { boxShadow: '0 0 20px #FF6EB4, 0 0 40px #FF6EB4, 0 0 80px rgba(255,110,180,0.8), 0 0 120px rgba(255,0,255,0.4)' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0.3' },
        },
        rise: {
          '0%': { transform: 'translateY(110vh)', opacity: '0.8' },
          '100%': { transform: 'translateY(-20vh)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
      boxShadow: {
        'neon-pink': '0 0 10px #FF6EB4, 0 0 20px #FF6EB4, 0 0 40px rgba(255,110,180,0.5)',
        'neon-yellow': '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 40px rgba(255,215,0,0.5)',
        'neon-blue': '0 0 10px #5BC0EB, 0 0 20px #5BC0EB, 0 0 40px rgba(91,192,235,0.5)',
        'pixel': '4px 4px 0px rgba(0,0,0,0.5)',
        'pixel-pink': '4px 4px 0px #C0569A',
        'pixel-yellow': '4px 4px 0px #CC9900',
      },
    },
  },
  plugins: [],
};
