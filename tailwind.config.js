/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        header: ['"Hind Madurai"', "sans-serif"],
        subheader: ["Orienta", "sans-serif"],
        paragraph: ['"Varela Round"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
