import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    List,
    MagnifyingGlass,
    SignOut,
    User,
    Moon,
    Sun,
    CaretLeft,
    CaretDoubleRight,
} from "@phosphor-icons/react";

import { IRootState } from "../../store";
import { toggleSidebar, toggleTheme } from "../../store/themeConfigSlice";
import { useAuthContext } from "../../contexts/AuthContext";

const Header = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const location = useLocation();
    const { user, logout } = useAuthContext();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isHome = location.pathname === "/";

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const isDark = themeConfig.theme === "dark";

    return (
        <header className="z-40">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between px-4 py-2.5 lg:px-6">
                    {/* Left: Back button + Logo (mobile) + Hamburger */}
                    <div className="flex items-center gap-1 lg:hidden">
                        {!isHome && (
                            <button
                                type="button"
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                onClick={() => navigate(-1)}
                                aria-label={t("Retour")}
                            >
                                <CaretLeft
                                    size={20}
                                    className="text-gray-700 dark:text-gray-300"
                                />
                            </button>
                        )}
                        <button
                            type="button"
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                            onClick={() => dispatch(toggleSidebar())}
                            aria-label={t("Ouvrir le menu")}
                        >
                            <List
                                size={22}
                                className="text-gray-700 dark:text-gray-300"
                            />
                        </button>
                        <Link to="/" className="flex items-center gap-1.5">
                            <img
                                className="w-8"
                                src="/assets/images/logo_gas_tp.png"
                                alt="Gaston"
                            />
                        </Link>
                    </div>

                    {/* Desktop: Sidebar reopen button (when collapsed) */}
                    {themeConfig.sidebar && (
                        <button
                            type="button"
                            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px] items-center justify-center"
                            onClick={() => dispatch(toggleSidebar())}
                            aria-label={t("Ouvrir la barre de navigation")}
                        >
                            <CaretDoubleRight
                                size={20}
                                className="text-gray-600 dark:text-gray-400"
                            />
                        </button>
                    )}

                    {/* Center: AI Search trigger */}
                    <div className="flex-1 flex justify-center lg:justify-start lg:ml-0">
                        <button
                            type="button"
                            onClick={() =>
                                window.dispatchEvent(
                                    new CustomEvent("open-command-bar"),
                                )
                            }
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors text-sm min-h-[44px] flex-1 sm:flex-initial max-w-xs sm:max-w-none"
                        >
                            <MagnifyingGlass size={16} />
                            <span className="truncate">{t("Rechercher ou poser une question...")}</span>
                            <kbd className="hidden sm:inline ml-2 px-1.5 py-0.5 text-[10px] bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 font-mono">
                                ⌘K
                            </kbd>
                        </button>
                    </div>

                    {/* Right: User avatar + dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
                            aria-label={user?.name || t("Profil")}
                        >
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        </button>

                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg py-1">
                                    {/* User info */}
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {user?.email}
                                        </p>
                                    </div>

                                    {/* Profile link */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            navigate("/profile");
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <User size={18} />
                                        {t("Mon profil")}
                                    </button>

                                    {/* Theme toggle */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            dispatch(
                                                toggleTheme(
                                                    isDark ? "light" : "dark",
                                                ),
                                            );
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {isDark ? (
                                            <Sun size={18} />
                                        ) : (
                                            <Moon size={18} />
                                        )}
                                        {isDark
                                            ? t("Mode clair")
                                            : t("Mode sombre")}
                                    </button>

                                    {/* Logout */}
                                    <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <SignOut size={18} />
                                            {t("Deconnexion")}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
