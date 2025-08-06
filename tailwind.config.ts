import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", // #100C1C (Dark Purple/Black)
        foreground: "hsl(var(--foreground))", // Light gray/white for text
        primary: {
          DEFAULT: "hsl(var(--primary))", // Main actions, could be a vibrant pink
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Accent, could be a lighter purple
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // Muted backgrounds for cards
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Gradients, highlights
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))", // Card background
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors based on the image
        "brand-dark-purple": "#100C1C",
        "brand-pink": "#FF00C7",
        "brand-light-purple": "#A020F0", // Or #C084FC
        "brand-gradient-from": "#FF00C7",
        "brand-gradient-to": "#A020F0",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "confetti-burst": {
          "0%": { opacity: "1", transform: "translateY(0) scale(0.5)" },
          "100%": { opacity: "0", transform: "translateY(-50px) scale(1.5)" },
        },
        ripple: {
          to: { transform: "scale(4)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "confetti-burst": "confetti-burst 0.8s ease-out forwards",
        ripple: "ripple 0.6s linear",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(to right, var(--brand-gradient-from), var(--brand-gradient-to))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
