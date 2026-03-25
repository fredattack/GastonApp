import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    House,
    PawPrint,
    Calendar,
    User,
    ForkKnife,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

interface Tab {
    path: string;
    icon: Icon;
    label: string;
    emoji?: string;
}

/**
 * Tab Bar Navigation - Style iOS
 * Navigation mobile en bas de l'écran avec 4 onglets principaux
 */
const TabBar: React.FC = () => {
    const location = useLocation();

    const tabs: Tab[] = [
        {
            path: "/",
            icon: House,
            emoji: "🏠",
            label: "Accueil",
        },
        {
            path: "/feeding",
            icon: ForkKnife,
            emoji: "🍽️",
            label: "Repas",
        },
        {
            path: "/content/pets",
            icon: PawPrint,
            emoji: "🐾",
            label: "Animaux",
        },
        {
            path: "/calendar",
            icon: Calendar,
            emoji: "📅",
            label: "Calendrier",
        },
        {
            path: "/profile",
            icon: User,
            emoji: "👤",
            label: "Profil",
        },
    ];

    const isActive = (path: string) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav
            className="
                fixed bottom-0 left-0 right-0 z-40
                bg-white dark:bg-gray-900
                border-t border-gray-200 dark:border-gray-800
                pb-safe
                lg:hidden
            "
            role="navigation"
            aria-label="Navigation principale mobile"
            data-testid="mobile-tab-bar"
        >
            <div className="grid grid-cols-5 h-16">
                {tabs.map((tab) => {
                    const active = isActive(tab.path);
                    const TabIcon = tab.icon;
                    return (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            data-testid={`tab-${tab.label.toLowerCase()}`}
                            className={`
                                flex flex-col items-center justify-center
                                min-h-[44px]
                                transition-colors duration-200
                                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset
                                ${
                                    active
                                        ? "text-primary"
                                        : "text-gray-500 dark:text-gray-400"
                                }
                            `}
                            aria-label={tab.label}
                            aria-current={active ? "page" : undefined}
                        >
                            {tab.emoji ? (
                                <span
                                    className="text-2xl mb-1"
                                    aria-hidden="true"
                                >
                                    {tab.emoji}
                                </span>
                            ) : (
                                <TabIcon
                                    size={24}
                                    className="mb-1"
                                    aria-hidden="true"
                                />
                            )}
                            <span className="text-xs font-medium">
                                {tab.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default TabBar;
