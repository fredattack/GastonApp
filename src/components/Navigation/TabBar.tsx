import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faPaw,
    faCalendar,
    faUser,
} from "@fortawesome/free-solid-svg-icons";

interface Tab {
    path: string;
    icon: any;
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
            icon: faHome,
            emoji: "🏠",
            label: "Accueil",
        },
        {
            path: "/content/pets",
            icon: faPaw,
            emoji: "🐾",
            label: "Animaux",
        },
        {
            path: "/",
            icon: faCalendar,
            emoji: "📅",
            label: "Calendrier",
        },
        {
            path: "/profile",
            icon: faUser,
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
        >
            <div className="grid grid-cols-4 h-16">
                {tabs.map((tab) => {
                    const active = isActive(tab.path);
                    return (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`
                                flex flex-col items-center justify-center
                                min-h-[44px]
                                transition-colors duration-200
                                ${
                                    active
                                        ? "text-primary"
                                        : "text-gray-500 dark:text-gray-400"
                                }
                            `}
                        >
                            {tab.emoji ? (
                                <span className="text-2xl mb-1">
                                    {tab.emoji}
                                </span>
                            ) : (
                                <FontAwesomeIcon
                                    icon={tab.icon}
                                    className="text-xl mb-1"
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
