/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#B38B56", // A richer, warmer tan for a luxurious feel
                    light: "#F3E8D6", // A soft, neutral cream for contrast
                    "dark-light": "rgba(179,139,86,0.15)",
                },
                secondary: {
                    DEFAULT: "#6C4A9E", // A slightly muted purple for sophistication
                    light: "#EEE5F9", // A soft lavender for a calming effect
                    "dark-light": "rgba(108,74,158,0.15)",
                },
                success: {
                    DEFAULT: "#009E60", // A deeper green for better readability
                    light: "#D4F7E2", // A refreshing mint tone for accents
                    "dark-light": "rgba(0,158,96,0.15)",
                },
                danger: {
                    DEFAULT: "#D93A42", // A bold but balanced red to grab attention
                    light: "#FFE1E1", // A soft pastel red for contrast
                    "dark-light": "rgba(217,58,66,0.15)",
                },
                warning: {
                    DEFAULT: "#D48A1C", // A warmer, more inviting amber tone
                    light: "#FFF3D4", // A subtle golden tone for highlights
                    "dark-light": "rgba(212,138,28,0.15)",
                },
                info: {
                    DEFAULT: "#D6A978", // A rich, elegant beige for information
                    light: "#F7EBDD", // A light neutral with warmth
                    "dark-light": "rgba(214,169,120,0.15)",
                },
                dark: {
                    DEFAULT: "#323545", // A deeper shade for better contrast
                    light: "#E1E1E3", // A balanced gray for text
                    "dark-light": "rgba(50,53,69,0.15)",
                },
                black: {
                    DEFAULT: "#121826", // A deeper, true black for clarity
                    light: "#DADCE5", // A light gray for depth
                    "dark-light": "rgba(18,24,38,0.15)",
                },
                white: {
                    DEFAULT: "#FFFFFF",
                    light: "#F5F7FA", // A bright but soft white
                    dark: "#A3A8B8", // A cooler gray for better contrast
                },
            },

            fontFamily: {
                nunito: ["Nunito", "sans-serif"],
            },
            spacing: {
                4.5: "18px",
            },
            boxShadow: {
                "3xl": "0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)",
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        "--tw-prose-invert-headings":
                            theme("colors.white.dark"),
                        "--tw-prose-invert-links": theme("colors.white.dark"),
                        h1: {
                            fontSize: "40px",
                            marginBottom: "0.5rem",
                            marginTop: 0,
                        },
                        h2: {
                            fontSize: "32px",
                            marginBottom: "0.5rem",
                            marginTop: 0,
                        },
                        h3: {
                            fontSize: "28px",
                            marginBottom: "0.5rem",
                            marginTop: 0,
                        },
                        h4: {
                            fontSize: "24px",
                            marginBottom: "0.5rem",
                            marginTop: 0,
                        },
                        h5: {
                            fontSize: "20px",
                            marginBottom: "0.5rem",
                            marginTop: 0,
                        },
                        h6: {
                            fontSize: "16px",
                            marginBottom: "0.5rem",
                            marginTop: 0,
                        },
                        p: { marginBottom: "0.5rem" },
                        li: { margin: 0 },
                        img: { margin: 0 },
                    },
                },
            }),
        },
    },
    plugins: [
        require("@tailwindcss/forms")({
            strategy: "class",
        }),
        require("@tailwindcss/typography"),
    ],
};
