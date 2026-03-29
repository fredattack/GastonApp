import {
    House,
    PawPrint,
    Calendar,
    ForkKnife,
    User,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

export interface NavItem {
    path: string;
    icon: Icon;
    labelKey: string;
    label: string;
}

export const NAV_ITEMS: NavItem[] = [
    { path: "/", icon: House, labelKey: "nav.home", label: "Accueil" },
    {
        path: "/content/pets",
        icon: PawPrint,
        labelKey: "nav.animals",
        label: "Animaux",
    },
    {
        path: "/feeding",
        icon: ForkKnife,
        labelKey: "nav.feeding",
        label: "Repas",
    },
    {
        path: "/calendar",
        icon: Calendar,
        labelKey: "nav.calendar",
        label: "Calendrier",
    },
    { path: "/profile", icon: User, labelKey: "nav.profile", label: "Profil" },
];
