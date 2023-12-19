module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  variants: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        main: '#00EAFF',
        neutral: {
          950: '#131313',
        },
        cyan: {
          650: '#007A85',
        },
        slate: {
          750: '#272727',
        },
      },
      fontSize: {
        22: ['1.375rem', '22px'],
      },
      boxShadow: {
        default: '0px 2px 4px 4px rgba(0, 0, 0, 0.75)',
        glow: '0px 2px 4px 4px rgba(0, 0, 0, 0.75), 0px 2px 12px 1px theme(colors.main)',
      },
      keyframes: {
        opacity: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        opacity: 'opacity 0.5s ease-in-out 1',
      },
      backgroundImage: {
        'login-bg': "url('../../assets/images/login-background.png')",
        'main-bg': "url('../../assets/images/main-background.png')",
        'settings-bg': "url('../../assets/images/settings-background.png')",
        'registration-bg':
          "url('../../assets/images/registration-background.png')",
        'update-bg': "url('../../assets/images/downloading-background.png')",
        'mods-bg': "url('../../assets/images/mods-background.png')",
        // components
        wall: "url('../../assets/images/wall.png')",
      },
    },
  },
};
