/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/**/*.{edge,js,ts,jsx,tsx,vue}',
    './ node_modules / flyonui / dist / js/*.js'
  ],
  theme: {
    extend: {},
  },
  flyonui: {
    themes: ["light", "dark", "gourmet"]
  },
  plugins: [
    require("flyonui"),
    require("flyonui/plugin")
  ],
}

