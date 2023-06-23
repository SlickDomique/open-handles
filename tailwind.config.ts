import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#0560ff",
        blueLight: "#0599fc",
        blueDark: "#4a6187",
        red: "#fa655a",
        green: "#5afa6d",
        grayDark: "#111",
        gray: "#333",
        grayLight: "#f1f1f1",
        buttonBg: "#f1f1f1",
        buttonBgHover: "#ddd",
      },
      container: {
        center: true,
      },
      fontFamily: {
        sans: ["Roboto"],
        mono: ["Courier New"],
      },
    },
  },
  plugins: [],
} satisfies Config;
