import React, { createContext, useContext } from 'react';
import { faAngleUp,faAnglesLeft, faAnglesRight, faBars, faMicrophone,faPaw, faUtensils,faCapsules,faGauge } from '@fortawesome/free-solid-svg-icons';

const IconContext = createContext<Record<string, unknown> | undefined>(undefined);

export const IconProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const icons = {
        angleUp: faAngleUp,
        anglesLeft: faAnglesLeft,
        anglesRight: faAnglesRight,
        bars:faBars,
        capsules: faCapsules,
        gauge: faGauge,
        microphone: faMicrophone,
        paw: faPaw,
        utensils: faUtensils,
        // Add more icons here
    };

    return (
        <IconContext.Provider value={icons}>
            {children}
        </IconContext.Provider>
    );
};

export const useIcons = () => useContext(IconContext);
