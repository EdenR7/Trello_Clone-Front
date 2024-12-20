/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  safelist: [
    "bg-green-700  ",
    "bg-green-600",
    "bg-green-500 ",
    "shadow-archive-card-shadow",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        btn_bg_primary: "#091e420f",
        btn_bg_primary_hover: "hsl(218, 13%, 80%)",
        text_dark_blue: "#172b4d",
        btn_primary_hover: "#0055cc",
        progress_complete: "#15803d",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', "sans-serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
      },
      transitionProperty: {
        height: "height",
      },
      backgroundImage: {
        "gradient-yellow":
          "linear-gradient(to right, #FFE97C, hsl(45, 80%, 71%))",
        "gradient-yellow-reverse":
          "linear-gradient(to right, hsl(45, 80%, 61%), #FFE97C)",
        ocean: "linear-gradient(80deg, #0C66E4 2%, #37B4C3 100%)",
        space: "linear-gradient(80deg, #0C66E4 2%, #09326C 100%)",
        sunset: "linear-gradient(80deg, #09326C 2%, #CD519D 100%)",
        galaxy: "linear-gradient(80deg, #6E5DC6 2%, #E774BB 100%)",
        lava: "linear-gradient(80deg, #E34935 2%, #FAA53D 100%)",
        rose: "linear-gradient(80deg, #E774BB 2%, #F87462 100%)",
        tropical: "linear-gradient(80deg, #1F845A 2%, #60C6D2 100%)",
        twilight: "linear-gradient(80deg, #505F79 2%, #172B4D 100%)",
        desert: "linear-gradient(80deg, #43290F 2%, #AE2A19 100%)",
      },
      screens: {
        "1col": "350px",

        "break-400px": "400px",
        "break-500px": "500px",
        "break-600px": "600px",
        "break-650px": "650px",
        "break-700px": "700px",
        "break-card_modal": "750px",
        "break-800px": "800px",
        "break-850px": "850px",
        "break-950px": "950px",
        "break-1000px": "1000px",
        "break-1200px": "1200px",
        "2col": "750px",
        "3col": "1100px",
      },
      spacing: {
        400: "400px",
        500: "500px",
        600: "600px",
        700: "700px",
        800: "800px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      gridTemplateRows: {
        layout: "auto 1fr",
      },
      gridTemplateColumns: {
        popover_layout: "32px, 1fr, 32px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        "shadow-archive-card-shadow": "rgba(9, 30, 66, 0.25) 0px 1px 1px 0px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
