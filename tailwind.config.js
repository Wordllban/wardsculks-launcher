module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      backgroundImage: {
        main: "url('../../assets/images/background.png')",
      },
    },
  },
};
