import React, { createContext, useContext } from "react";
import {
    CaretUp,
    CaretDoubleLeft,
    CaretDoubleRight,
    List,
    Microphone,
    House,
    PawPrint,
    ForkKnife,
    Pill,
    Gauge,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

const IconContext = createContext<Record<string, Icon> | undefined>(
    undefined,
);

export const IconProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const icons: Record<string, Icon> = {
        angleUp: CaretUp,
        anglesLeft: CaretDoubleLeft,
        anglesRight: CaretDoubleRight,
        bars: List,
        capsules: Pill,
        gauge: Gauge,
        home: House,
        microphone: Microphone,
        paw: PawPrint,
        utensils: ForkKnife,
    };

    return (
        <IconContext.Provider value={icons}>{children}</IconContext.Provider>
    );
};

export const useIcons = () => useContext(IconContext);
