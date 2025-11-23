import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Stripe-inspired color palette
                stripe: {
                    dark: "#0A2540", // Downriver - deep blue for dark text/backgrounds
                    blue: "#635BFF", // Cornflower Blue - primary action color
                    blurple: "#7A73FF", // Lighter blue for gradients
                    slate: "#425466", // Slate gray for secondary text
                    light: "#F6F9FC", // Black Squeeze - light background
                    white: "#FFFFFF",
                },
                gray: {
                    50: "#F6F9FC",
                    100: "#E3E8EE",
                    200: "#CBD2D9",
                    300: "#9AA5B1",
                    400: "#7B8794",
                    500: "#616E7C",
                    600: "#52606D",
                    700: "#3E4C59",
                    800: "#323F4B",
                    900: "#1F2933",
                },
                blue: {
                    50: "#E6F0FF",
                    100: "#B3D7FF",
                    200: "#80BFFF",
                    300: "#4DA6FF",
                    400: "#1A8CFF",
                    500: "#0073E6",
                    600: "#635BFF", // Primary blue
                    700: "#4B47CC",
                    800: "#3A3799",
                    900: "#282666",
                },
                teal: {
                    500: "#00D4FF",
                    600: "#00B8E6",
                },
                emerald: {
                    500: "#00E6B8",
                },
                orange: {
                    500: "#FF6B35",
                },
                // Keep DAV brand colors
                primary: "#003366",
                secondary: "#D4AF37",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
                display: ["Inter", "system-ui", "sans-serif"],
            },
            fontSize: {
                "xs": ["0.75rem", { lineHeight: "1rem" }],
                "sm": ["0.875rem", { lineHeight: "1.25rem" }],
                "base": ["1rem", { lineHeight: "1.5rem" }],
                "lg": ["1.125rem", { lineHeight: "1.75rem" }],
                "xl": ["1.25rem", { lineHeight: "1.75rem" }],
                "2xl": ["1.5rem", { lineHeight: "2rem" }],
                "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
                "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
                "5xl": ["3rem", { lineHeight: "1" }],
                "6xl": ["3.75rem", { lineHeight: "1" }],
            },
            spacing: {
                // 8-point grid system
                "1": "0.25rem", // 4px
                "2": "0.5rem",  // 8px
                "3": "0.75rem", // 12px
                "4": "1rem",    // 16px
                "5": "1.25rem", // 20px
                "6": "1.5rem",  // 24px
                "8": "2rem",    // 32px
                "10": "2.5rem", // 40px
                "12": "3rem",   // 48px
                "16": "4rem",   // 64px
                "20": "5rem",   // 80px
                "24": "6rem",   // 96px
            },
            boxShadow: {
                "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                "DEFAULT": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
                "stripe": "0 4px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
                "stripe-lg": "0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3)",
            },
            borderRadius: {
                "none": "0",
                "sm": "0.375rem",   // 6px
                "DEFAULT": "0.5rem", // 8px
                "md": "0.5rem",     // 8px
                "lg": "0.75rem",    // 12px
                "xl": "1rem",       // 16px
                "2xl": "1.5rem",    // 24px
                "full": "9999px",
            },
            backdropBlur: {
                xs: "2px",
                sm: "4px",
                DEFAULT: "8px",
                md: "12px",
                lg: "16px",
                xl: "24px",
            },
            animation: {
                "float": "float 3s ease-in-out infinite",
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
