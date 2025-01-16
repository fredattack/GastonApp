import {
    PropsWithChildren,
    useEffect
} from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';

import React from 'react'
import Bugsnag from '@bugsnag/js'

import BugsnagPluginReact from '@bugsnag/plugin-react'

import BugsnagPerformance from '@bugsnag/browser-performance'


import store, {
    IRootState
} from './store';
import {
    toggleRTL,
    toggleTheme,
    toggleLocale,
    toggleMenu,
    toggleLayout,
    toggleAnimation,
    toggleNavbar,
    toggleSemidark
} from './store/themeConfigSlice';

import {
    IconProvider
} from './providers/FontawesomeProvider';
import {
    GlobalProvider
} from './contexts/GlobalContext';



function App({ children }: PropsWithChildren) {

    Bugsnag.start({
        apiKey: '05ccd85ddac435639e21692be85d8bf8',
        plugins: [new BugsnagPluginReact()]
    })
    BugsnagPerformance.start({ apiKey: '05ccd85ddac435639e21692be85d8bf8' })

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const ErrorBoundary = Bugsnag.getPlugin('react')?.createErrorBoundary(React);

    if (!ErrorBoundary) {
        throw new Error("Bugsnag React plugin is not available");
    }

    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
    }, [dispatch, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.locale, themeConfig.semidark]);

    return (
        <ErrorBoundary>
        <IconProvider>
            <GlobalProvider>
                <div
                    className={`${(store.getState().themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${
                        themeConfig.rtlClass
                    } main-section antialiased relative font-nunito text-sm font-normal`}
                >
                    {children}
                </div>
            </GlobalProvider>
        </IconProvider>
        </ErrorBoundary>

    );
}

export default App;
