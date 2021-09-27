module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "dark-primary": "#18191A",
        "dark-secondary": "#242526",
        "dark-third": "#3A3B3C",
        "dark-hover": "#454849",
        "dark-txt": "#B8BBBF",
      },
      maxWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "2/3": "66.666667%",
        "2/5": "40%",
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
        "2/3": "66.666667%",
        "2/5": "40%",
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
      minWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "2/3": "66.666667%",
        "2/5": "40%",
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
      minHeight: {
        "1/4": "25%",
        "1/2": "50%",
        "2/3": "66.666667%",
        "2/5": "40%",
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
        fadeIn: "fadeIn 0.3s ease-in-out",
        fadeOut: "fadeOut 0.3s ease-in-out forwards",
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
      },
      keyframes: (theme) => ({
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "99%": { opacity: 0 },
          "100%": { display: "none", visibility: "hidden" },
        },
      }),
    },
    fontFamily: {
      title: ["Roboto", "Helvetica", "Arial", "sans-serif"],
      content: ["Nunito", "Roboto", "Helvetica", "Arial", "sans-serif"],
    },
  },
  variants: {
    gradientColorStops: ["active", "group-hover", "dark"],
    transform: ["responsive", "hover", "focus", "active", "group-hover"],
    scale: ["responsive", "hover", "focus", "active", "group-hover"],
    extend: {
      backgroundColor: ["active", "disabled"],
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
