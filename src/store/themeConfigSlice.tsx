import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";
import themeConfig from "../theme.config";

const defaultState = {
    isDarkMode: false,
    mainLayout: "app",
    theme: "light",
    menu: "vertical",
    layout: "full",
    rtlClass: "ltr",
    animation: "",
    navbar: "navbar-sticky",
    locale: "en",
    sidebar: false,
    pageTitle: "",
    languageList: [
        {
            code: "zh",
            name: "Chinese",
        },
        {
            code: "da",
            name: "Danish",
        },
        {
            code: "en",
            name: "English",
        },
        {
            code: "fr",
            name: "French",
        },
        {
            code: "de",
            name: "German",
        },
        {
            code: "el",
            name: "Greek",
        },
        {
            code: "hu",
            name: "Hungarian",
        },
        {
            code: "it",
            name: "Italian",
        },
        {
            code: "ja",
            name: "Japanese",
        },
        {
            code: "pl",
            name: "Polish",
        },
        {
            code: "pt",
            name: "Portuguese",
        },
        {
            code: "ru",
            name: "Russian",
        },
        {
            code: "es",
            name: "Spanish",
        },
        {
            code: "sv",
            name: "Swedish",
        },
        {
            code: "tr",
            name: "Turkish",
        },
    ],
    semidark: false,
};

const initialState = {
    theme: localStorage.getItem("theme") || themeConfig.theme,
    menu: localStorage.getItem("menu") || themeConfig.menu,
    layout: localStorage.getItem("layout") || themeConfig.layout,
    rtlClass: localStorage.getItem("rtlClass") || themeConfig.rtlClass,
    animation: localStorage.getItem("animation") || themeConfig.animation,
    navbar: localStorage.getItem("navbar") || themeConfig.navbar,
    locale: localStorage.getItem("i18nextLng") || themeConfig.locale,
    isDarkMode: false,
    sidebar: localStorage.getItem("sidebar") || defaultState.sidebar,
    semidark: localStorage.getItem("semidark") || themeConfig.semidark,
    languageList: [
        {
            code: "zh",
            name: "Chinese",
        },
        {
            code: "da",
            name: "Danish",
        },
        {
            code: "en",
            name: "English",
        },
        {
            code: "fr",
            name: "French",
        },
        {
            code: "de",
            name: "German",
        },
        {
            code: "el",
            name: "Greek",
        },
        {
            code: "hu",
            name: "Hungarian",
        },
        {
            code: "it",
            name: "Italian",
        },
        {
            code: "ja",
            name: "Japanese",
        },
        {
            code: "pl",
            name: "Polish",
        },
        {
            code: "pt",
            name: "Portuguese",
        },
        {
            code: "ru",
            name: "Russian",
        },
        {
            code: "es",
            name: "Spanish",
        },
        {
            code: "sv",
            name: "Swedish",
        },
        {
            code: "tr",
            name: "Turkish",
        },
        {
            code: "ae",
            name: "Arabic",
        },
    ],
};

const themeConfigSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        toggleTheme(state, action) {
            const newPayload: string = action.payload || state.theme;
            return {
                ...state,
                theme: newPayload,
                isDarkMode: newPayload === "dark",
            };
        },
        toggleMenu(state, { payload }) {
            const fnPayload = payload || state.menu; // vertical, collapsible-vertical, horizontal
            localStorage.setItem("menu", fnPayload);
            return {
                ...state,
                sidebar: false,
                menu: fnPayload,
            };
        },
        toggleLayout(state, { payload }) {
            const fnPayload = payload || state.layout;
            localStorage.setItem("layout", fnPayload);
            return {
                ...state,
                layout: fnPayload,
            };
        },
        toggleRTL(state, { payload }) {
            const fnPayload = payload || state.rtlClass; // rtl, ltr
            localStorage.setItem("rtlClass", fnPayload);
            document
                .querySelector("html")
                ?.setAttribute("dir", fnPayload || "ltr");
            return {
                ...state,
                rtlClass: fnPayload,
            };
        },
        toggleAnimation(state, { payload }) {
            let fnPayload = payload || state.animation; // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
            fnPayload = fnPayload?.trim();
            localStorage.setItem("animation", fnPayload);
            return {
                ...state,
                animation: fnPayload,
            };
        },
        toggleNavbar(state, { payload }) {
            const fnPayload = payload || state.navbar; // navbar-sticky, navbar-floating, navbar-static

            localStorage.setItem("navbar", fnPayload);
            return {
                ...state,
                navbar: fnPayload,
            };
        },
        toggleSemidark(state, { payload }) {
            const fnPayload = payload === true || payload === "true";
            localStorage.setItem("semidark", String(fnPayload));
            return {
                ...state,
                semidark: fnPayload,
            };
        },
        toggleLocale(state, { payload }) {
            const fnPayload = payload || state.locale;
            i18next.changeLanguage(fnPayload);
            return {
                ...state,
                locale: fnPayload,
            };
        },
        toggleSidebar(state) {
            console.log("boom", state);
            return {
                ...state,
                sidebar: !state.sidebar,
            };
        },

        setPageTitle(state, { payload }) {
            document.title = `${payload} | Gaston App`;
        },
    },
});

export const {
    toggleTheme,
    toggleMenu,
    toggleLayout,
    toggleRTL,
    toggleAnimation,
    toggleNavbar,
    toggleSemidark,
    toggleLocale,
    toggleSidebar,
    setPageTitle,
} = themeConfigSlice.actions;

export default themeConfigSlice.reducer;
