module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  variants: {
    extend: {},
  },
  plugins: [],
  theme: {
    colors: {
      main: '#00EAFF',
      neutral: {
        950: '#131313',
      },
    },
    extend: {
      fontSize: {
        20: '1.375rem',
      },
      boxShadow: {
        default: '0px 2px 4px 4px rgba(0, 0, 0, 0.75)',
        glow: '0px 2px 4px 4px rgba(0, 0, 0, 0.75), 0px 2px 12px 1px theme(colors.main)',
      },
      backgroundImage: {
        // login page
        'login-main': "url('../../assets/images/login-background.png')",
        'start-sides':
          "url('../../assets/images/start-wall-right.png'), url('../../assets/images/start-wall-left.png')",
        // components
        wall: "url('../../assets/images/wall.png')",
      },
    },
  },
};
