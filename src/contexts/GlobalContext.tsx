// src/contexts/GlobalContext.tsx
import React from 'react';
import { MessageProvider } from './MessageContext';
import { PetsProvider } from './PetsContext';
import {
    ToastProvider
} from '../providers/ToastProvider';
// import { TasksProvider } from './TasksContext'; // Exemple pour un futur contexte

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <MessageProvider>
        <ToastProvider >
        <PetsProvider>
            {/* Ajouter ici d'autres Providers si nécessaire */}
            {children}
        </PetsProvider>
        </ToastProvider>
        </MessageProvider>
    );
};
