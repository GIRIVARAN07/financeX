/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#a855f7",
        glow: "#c084fc",
        accent: "#ec4899",
        background: "#0a0a0f",
        card: "#11111a",
        text: "#e5e7eb",
        "muted-text": "#9ca3af"
      },
      boxShadow: {
        'neon': '0 0 10px rgba(192, 132, 252, 0.5), 0 0 20px rgba(192, 132, 252, 0.3)',
        'neon-strong': '0 0 15px rgba(192, 132, 252, 0.7), 0 0 30px rgba(192, 132, 252, 0.5)',
        'neon-accent': '0 0 10px rgba(236, 72, 153, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
