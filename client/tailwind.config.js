/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}",
    // add any other paths where you use Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        // keep your custom palette entries if you use them elsewhere
        beige: {
          50: '#FBF7F4',
          100: '#F6F0EB'
        }
      }
    }
  },
  plugins: [],
  safelist: [
    // gradients & background utilities used dynamically
    'bg-gradient-to-br', 'bg-gradient-to-r',
    'from-purple-50','via-white','to-beige-50',
    'from-purple-500','to-purple-600',
    'from-blue-500','to-blue-600',
    'from-green-500','to-green-600',
    'from-pink-500','to-pink-600',
    'from-purple-600','to-purple-700','to-purple-800',

    // badge / difficulty classes
    'bg-green-100','text-green-700',
    'bg-yellow-100','text-yellow-700',
    'bg-red-100','text-red-700',
    'bg-gray-100','text-gray-700',

    // common button / text classes you might use dynamically
    'text-purple-600','text-purple-700','text-gray-900',
    'bg-gray-300','text-gray-600',

    // some extras that match your UI
    'rounded-3xl','rounded-2xl','rounded-xl',
    'hover:from-purple-700','hover:to-purple-800'
  ]
};
