import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleSidebar } from "../../store/themeConfigSlice";
import { IRootState } from "../../store";

// @ts-ignore
import { useIcons } from "@/providers/FontawesomeProvider";

/**
 * Sidebar Navigation - Desktop Only
 * Navigation principale simplifiée avec 4 éléments essentiels
 * Cachée sur mobile (< lg) où le TabBar est utilisé
 */
const Sidebar = () => {
    const semidark = useSelector(
        (state: IRootState) => state.themeConfig.semidark,
    );

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const icons = useIcons();

    return (
        <div className={semidark ? "dark" : ""}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 hidden lg:block ${semidark ? "text-white-dark" : ""}`}
            >
                <div className="bg-white dark:bg-gray-900 h-full">
                    {/* Logo & Collapse Button */}
                    <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-gray-800">
                        <NavLink
                            to="/"
                            className="main-logo flex items-center shrink-0"
                        >
                            <img
                                className="w-10 flex-none"
                                src="/assets/images/logo_gas_tp.png"
                                alt="logo gaston"
                            />
                            <span className="text-2xl ltr:ml-2 rtl:mr-2 font-semibold dark:text-white">
                                Gaston
                            </span>
                        </NavLink>

                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white transition-colors"
                            onClick={() => dispatch(toggleSidebar())}
                            aria-label="Toggle sidebar"
                        >
                            <FontAwesomeIcon
                                icon={icons.anglesLeft}
                                className="text-gray-600 dark:text-gray-400"
                            />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-4">
                        <ul className="space-y-1">
                            <li>
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] ${
                                            isActive
                                                ? "bg-primary text-white"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`
                                    }
                                >
                                    <span className="text-xl">🏠</span>
                                    <span className="font-medium">
                                        {t("home")}
                                    </span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/content/pets"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] ${
                                            isActive
                                                ? "bg-primary text-white"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`
                                    }
                                >
                                    <span className="text-xl">🐾</span>
                                    <span className="font-medium">
                                        {t("animals")}
                                    </span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] ${
                                            isActive
                                                ? "bg-primary text-white"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`
                                    }
                                >
                                    <span className="text-xl">📅</span>
                                    <span className="font-medium">
                                        Calendrier
                                    </span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] ${
                                            isActive
                                                ? "bg-primary text-white"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`
                                    }
                                >
                                    <span className="text-xl">👤</span>
                                    <span className="font-medium">
                                        Profil
                                    </span>
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
