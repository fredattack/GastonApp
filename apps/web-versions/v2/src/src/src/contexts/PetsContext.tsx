// src/contexts/PetsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { modelService } from "../services/index";

interface PetsContextType {
    pets: Pet[];
    isLoading: boolean;
    refreshPets: () => void;
}

const PetsContext = createContext<PetsContextType | undefined>(undefined);

export const PetsProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchPets = async () => {
        setIsLoading(true);
        try {
            const data = await modelService.getModels("pets");
            setPets(data);
        } catch (error) {
            console.error("Failed to fetch pets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    return (
        <PetsContext.Provider
            value={{
                pets,
                isLoading,
                refreshPets: fetchPets,
            }}
        >
            {children}
        </PetsContext.Provider>
    );
};

export const usePets = (): PetsContextType => {
    const context = useContext(PetsContext);
    if (!context) {
        throw new Error("usePets must be used within a PetsProvider");
    }
    return context;
};
