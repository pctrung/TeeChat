module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        100: "100px",
        150: "150px",
        200: "200px",
        250: "250px",
        300: "300px",
        350: "350px",
        400: "400px",
        450: "450px",
        500: "500px",
      },
      maxHeight: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        100: "100px",
        150: "150px",
        200: "200px",
        250: "250px",
        300: "300px",
        350: "350px",
        400: "400px",
        450: "450px",
        500: "500px",
      },
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
    transform: ["responsive", "hover", "focus", "active", "group-hover"],
    scale: ["responsive", "hover", "focus", "active", "group-hover"],
    extend: {
      backgroundColor: ["active", "disabled"],
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
