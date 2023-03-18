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
      },
      fontSize: {
        22: ['1.375rem', '22px'],
      },
      boxShadow: {
        default: '0px 2px 4px 4px rgba(0, 0, 0, 0.75)',
        glow: '0px 2px 4px 4px rgba(0, 0, 0, 0.75), 0px 2px 12px 1px theme(colors.main)',
      },
      backgroundImage: {
        // login
        'login-bg': "url('../../assets/images/login-background.png')",
        'login-sides':
          "url('../../assets/images/login-wall-right.png'), url('../../assets/images/login-wall-left.png')",
        // main
        'main-bg': "url('../../assets/images/main-background.png')",
        'main-sides':
          "url('../../assets/images/main-wall-right.png'), url('../../assets/images/main-wall-left.png')",
        // components
        wall: "url('../../assets/images/wall.png')",
      },
    },
  },
};
