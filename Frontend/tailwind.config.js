/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        logo: "#b3efdc",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          '.scrollbar-hidden': {
            /* Hide scrollbar for WebKit browsers */
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            /* Hide scrollbar for Firefox */
            'scrollbar-width': 'none',
          },
        },
        ['responsive', 'hover']
      );
    },
  ],
}
