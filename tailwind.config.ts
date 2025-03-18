import type { Config } from "tailwindcss/types";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // 'media' or 'class'
  theme: {
    extend: {},
  },
  corePlugins: { preflight: true },
  plugins: [typography],
};

export default config;
