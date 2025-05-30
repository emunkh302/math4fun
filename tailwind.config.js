// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Adjust this if your file extensions or structure differ
      "./public/index.html"
    ],
    theme: {
      extend: {
        fontFamily: {
          // Add kid-friendly fonts here if you have them loaded
          // Example: 'comic-sans': ['"Comic Sans MS"', 'cursive', 'sans-serif'],
          // For now, we can rely on system fonts or a generic sans-serif and style later
        },
        // You can extend colors, animations, etc., here for a more "addictive" look
        colors: {
          brand: { // Example custom colors
            primary: '#3b82f6', // blue-500
            secondary: '#10b981', // emerald-500
            accent: '#f59e0b', // amber-500
            background: '#f0f9ff' // sky-50
          }
        },
        animation: {
          'bounce-slow': 'bounce 3s infinite',
          'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
          'pulse-custom': 'pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
          'pulse-custom': {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '.5' },
          }
        }
      },
    },
    plugins: [],
  }