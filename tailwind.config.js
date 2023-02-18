module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  variants: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      backgroundImage: {
        // login page
        'login-main': "url('../../assets/images/background.png')",
        'login-sides':
          "url('../../assets/images/wall-left.png'), url('../../assets/images/wall-right.png')",
      },
    },
  },
};
