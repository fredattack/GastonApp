import React, { createContext, useContext } from 'react';
import { faAngleUp,faAnglesLeft, faBars, faPaw, faUtensils,faCapsules,faGauge } from '@fortawesome/free-solid-svg-icons';

const IconContext = createContext<Record<string, unknown> | undefined>(undefined);

export const IconProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const icons = {
        angleUp: faAngleUp,
        anglesLeft: faAnglesLeft,
        bars:faBars,
        paw: faPaw,
        utensils: faUtensils,
        capsules: faCapsules,
        gauge: faGauge
        // Add more icons here
    };

    return (
        <IconContext.Provider value={icons}>
            {children}
        </IconContext.Provider>
    );
};

export const useIcons = () => useContext(IconContext);
