/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
   content: ["app/**/*.{tsx,jsx,ts,js}", "helper/**/*.{tsx,jsx,ts,js}","components/**/*.{tsx,jsx,ts,js}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}