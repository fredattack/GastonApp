// src/contexts/PetsContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { modelService } from '../services/index';

// TypeScript type for a Pet
interface Pet {
    id: number;
    ownerId: string;
    name: string;
    species: string;
    breed: string;
    dateOfBirth: string;
    photo: string;
    tasks: string[];
    isActive: boolean;
    created_at: string;
}

interface PetsContextType {
    pets: Pet[];
    refreshPets: () => void;
}

const PetsContext = createContext<PetsContextType | undefined>(undefined);

export const PetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pets, setPets] = useState<Pet[]>([]);

    const fetchPets = async () => {
        try {
            const data = await modelService.getModels('pets');
            setPets(data);
        } catch (error) {
            console.error('Failed to fetch pets:', error);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    return <PetsContext.Provider value={{ pets, refreshPets: fetchPets }}>{children}</PetsContext.Provider>;
};

export const usePets = (): PetsContextType => {
    const context = useContext(PetsContext);
    if (!context) {
        throw new Error('usePets must be used within a PetsProvider');
    }
    return context;
};
