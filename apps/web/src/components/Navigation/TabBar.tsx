import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NAV_ITEMS } from "./navigationItems";

const TabBar: React.FC = () => {
    const location = useLocation();
    const { t } = useTranslation();

    const isActive = (path: string) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe lg:hidden"
            role="navigation"
            aria-label="Navigation principale mobile"
            data-testid="mobile-tab-bar"
        >
            <div className="grid grid-cols-5 h-16">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item.path);
                    const IconComponent = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            data-testid={`tab-${item.label.toLowerCase()}`}
                            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset ${
                                active
                                    ? "text-primary"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                            aria-label={t(item.labelKey, item.label)}
                            aria-current={active ? "page" : undefined}
                        >
                            <IconComponent
                                size={24}
                                weight={active ? "fill" : "regular"}
                                className="mb-1"
                                aria-hidden="true"
                            />
                            <span className="text-xs font-medium">
                                {t(item.labelKey, item.label)}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default TabBar;
