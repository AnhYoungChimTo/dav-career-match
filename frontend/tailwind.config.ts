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
                primary: "#003366", // DAV Blue-ish
                secondary: "#D4AF37", // Gold-ish
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
