/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "0 4px 26px rgba(0, 0, 0, 0.1), 0 1px 23px rgba(0, 0, 0, 0.06)",
        custom2:
          "0 4px 14px rgba(0, 0, 0, 0.1), 0 1px 13px rgba(0, 0, 0, 0.06)",
        custom3: "0 2px 10px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.06)",
      },
      backdropBlur: {
        16: "16px", // Add custom blur value
      },
    },
  },
  plugins: [],
};
