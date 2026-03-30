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
                // Design System: Eucalyptus Green
                primary: {
                    DEFAULT: "#8FA998",
                    50: "#F4F7F5",
                    100: "#E3EBE7",
                    200: "#C7D7CF",
                    300: "#ABC3B7",
                    400: "#8FA998",
                    500: "#7A9383",
                    600: "#657A6D",
                    700: "#506158",
                    800: "#3B4842",
                    900: "#262F2C",
                    light: "#E3EBE7",
                    "dark-light": "rgba(143,169,152,0.15)",
                },
                // Design System: Golden Honey
                secondary: {
                    DEFAULT: "#D4A574",
                    50: "#FAF6F1",
                    100: "#F2E8DC",
                    200: "#E8D4BA",
                    300: "#DEC097",
                    400: "#D4A574",
                    500: "#C18E5F",
                    600: "#A97649",
                    700: "#8B6039",
                    800: "#6D4A2A",
                    900: "#4F341C",
                    light: "#F2E8DC",
                    "dark-light": "rgba(212,165,116,0.15)",
                },
                // Design System: Background Lin Scale
                lin: {
                    0: "#FDFCFA",
                    1: "#F9F7F4",
                    2: "#F4F1E8",
                    3: "#EFEADC",
                    4: "#E9E3D0",
                    5: "#E0D8C3",
                    6: "#D6CBB5",
                    7: "#C8BDA6",
                    8: "#B9AD96",
                    9: "#A99D85",
                },
                // Design System: Accent Colors
                mint: {
                    light: "#B8F4DC",
                    DEFAULT: "#7CEDC3",
                    dark: "#4FD1A1",
                },
                lavender: {
                    light: "#E8D9F5",
                    DEFAULT: "#D1B3E8",
                    dark: "#B98DD9",
                },
                coral: {
                    light: "#FFD4C4",
                    DEFAULT: "#FFB59A",
                    dark: "#FF9670",
                },
                // Semantic Colors
                success: {
                    DEFAULT: "#7CEDC3",
                    light: "#D4F4E7",
                    dark: "#4FD1A1",
                    "dark-light": "rgba(124,237,195,0.15)",
                },
                danger: {
                    DEFAULT: "#FF6B6B",
                    light: "#FFE5E5",
                    dark: "#E54545",
                    "dark-light": "rgba(255,107,107,0.15)",
                },
                warning: {
                    DEFAULT: "#FFD84D",
                    light: "#FFF4D9",
                    dark: "#FFBB1A",
                    "dark-light": "rgba(255,216,77,0.15)",
                },
                info: {
                    DEFAULT: "#8FA998",
                    light: "#E3EBE7",
                    dark: "#657A6D",
                    "dark-light": "rgba(143,169,152,0.15)",
                },
                dark: {
                    DEFAULT: "#1A1A1A",
                    light: "#E1E1E3",
                    "dark-light": "rgba(26,26,26,0.15)",
                },
                black: {
                    DEFAULT: "#1A1A1A",
                    light: "#DADCE5",
                    "dark-light": "rgba(26,26,26,0.15)",
                },
                white: {
                    DEFAULT: "#FFFFFF",
                    light: "#FDFCFA",
                    dark: "#A99D85",
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
                // Design System: Warm tinted shadows
                "ds-xs": "0 1px 2px 0 rgba(143, 169, 152, 0.05)",
                "ds-sm": "0 2px 4px 0 rgba(143, 169, 152, 0.08), 0 1px 2px 0 rgba(143, 169, 152, 0.04)",
                "ds-md": "0 4px 8px 0 rgba(143, 169, 152, 0.12), 0 2px 4px 0 rgba(143, 169, 152, 0.06)",
                "ds-lg": "0 8px 16px 0 rgba(143, 169, 152, 0.16), 0 4px 8px 0 rgba(143, 169, 152, 0.08)",
                "ds-xl": "0 12px 24px 0 rgba(143, 169, 152, 0.20), 0 6px 12px 0 rgba(143, 169, 152, 0.10)",
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
