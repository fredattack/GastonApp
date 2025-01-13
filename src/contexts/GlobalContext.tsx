// src/contexts/GlobalContext.tsx
import React from 'react';
import { PetsProvider } from './PetsContext';
import {
    ToastProvider
} from '../providers/ToastProvider';
// import { TasksProvider } from './TasksContext'; // Exemple pour un futur contexte

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ToastProvider>
        <PetsProvider>
            {/* Ajouter ici d'autres Providers si nécessaire */}
            {children}
        </PetsProvider>
        </ToastProvider>
    );
};
