module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        fade: "fadeOut 0.3s ease-in-out",
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
      },
      keyframes: (theme) => ({
        fadeOut: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      }),
    },
    fontFamily: {
      title: ["Roboto", "Helvetica", "Arial", "sans-serif"],
      content: ["Nunito", "Roboto", "Helvetica", "Arial", "sans-serif"],
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active", "disabled"],
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
