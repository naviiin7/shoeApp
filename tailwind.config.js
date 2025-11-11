module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: '#53CAEC',
        deep: '#171412',
        cream: '#F3F0EA'
      },
      keyframes: {
        revealLeft: { '0%': { opacity: 0, transform: 'translateX(-20px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } }
      },
      animation: {
        'reveal-left': 'revealLeft .6s cubic-bezier(.2,.9,.2,1) both'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
