/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1b4332",
          dark: "#081c15",
          light: "#2d6a4f",
        },
        sage: {
          DEFAULT: "#2d6a4f",
          dark: "#1b4332",
          light: "#52b788",
          subtle: "#74c69d",
          pale: "#d8f3dc",
        },
        cream: {
          DEFAULT: "#f4f6f0",
          light: "#fafbfa",
          dark: "#e8ece0",
        },
        amber: {
          DEFAULT: "#d97706",
          light: "#f59e0b",
          dark: "#b45309",
          soft: "#fef3c7",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

