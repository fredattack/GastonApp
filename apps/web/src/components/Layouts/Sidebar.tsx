import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { CaretDoubleLeft } from "@phosphor-icons/react";
import { toggleSidebar } from "../../store/themeConfigSlice";
import { IRootState } from "../../store";
import { NAV_ITEMS } from "../Navigation/navigationItems";

const Sidebar = () => {
    const semidark = useSelector(
        (state: IRootState) => state.themeConfig.semidark,
    );
    const dispatch = useDispatch();
    const { t } = useTranslation();

    return (
        <div className={semidark ? "dark" : ""}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(143,169,152,0.1)] z-50 transition-all duration-300 ${semidark ? "text-white-dark" : ""}`}
                role="navigation"
                aria-label="Navigation principale desktop"
            >
                <div className="bg-white dark:bg-gray-900 h-full">
                    {/* Logo & Collapse Button */}
                    <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-gray-800">
                        <NavLink
                            to="/"
                            className="main-logo flex items-center shrink-0 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                        >
                            <img
                                className="w-10 flex-none"
                                src="/assets/images/logo_gas_tp.png"
                                alt="Logo Gaston"
                            />
                            <span className="text-2xl ml-2 font-semibold dark:text-white">
                                Gaston
                            </span>
                        </NavLink>

                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                            onClick={() => dispatch(toggleSidebar())}
                            aria-label="Reduire la barre de navigation"
                        >
                            <CaretDoubleLeft
                                size={20}
                                className="text-gray-600 dark:text-gray-400"
                            />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-4" aria-label="Menu principal">
                        <ul className="space-y-1" role="list">
                            {NAV_ITEMS.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            end={item.path === "/"}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                                                    isActive
                                                        ? "bg-primary text-white"
                                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                }`
                                            }
                                            aria-label={t(item.labelKey, item.label)}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <IconComponent
                                                        size={22}
                                                        weight={
                                                            isActive
                                                                ? "bold"
                                                                : "regular"
                                                        }
                                                        aria-hidden="true"
                                                    />
                                                    <span className="font-medium">
                                                        {t(
                                                            item.labelKey,
                                                            item.label,
                                                        )}
                                                    </span>
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
