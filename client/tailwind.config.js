/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#FBF7F4',
          100: '#F6F0EB',
        },
      },

      /* 🌈 Animations */
      animation: {
        fadeUp: "fadeUp 1s ease-out forwards",
        gradient: "gradientMove 6s ease infinite",
        floatSlow: "floatSlow 4s ease-in-out infinite",
      },

      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },

      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],

  safelist: [
    // gradients & background utilities
    'bg-gradient-to-br', 'bg-gradient-to-r',
    'from-purple-50','via-white','to-beige-50',
    'from-purple-500','to-purple-600',
    'from-blue-500','to-blue-600',
    'from-green-500','to-green-600',
    'from-pink-500','to-pink-600',
    'from-purple-600','to-purple-700','to-purple-800',

    // animation utilities
    'animate-fadeUp','animate-gradient','animate-floatSlow',
    'bg-[length:200%_200%]',

    // badge / difficulty classes
    'bg-green-100','text-green-700',
    'bg-yellow-100','text-yellow-700',
    'bg-red-100','text-red-700',
    'bg-gray-100','text-gray-700',

    // common button / text classes
    'text-purple-600','text-purple-700','text-gray-900',
    'bg-gray-300','text-gray-600',

    // rounded
    'rounded-3xl','rounded-2xl','rounded-xl',
    'hover:from-purple-700','hover:to-purple-800'
  ],
};
