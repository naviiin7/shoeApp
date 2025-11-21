module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        spotify: {
          500: '#1DB954' // main accent
        },
        matte: {
          50: '#f5f6f7',
          100: '#e9ecef',
          500: '#2b2f33',
          700: '#131416',
          900: '#080909'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
