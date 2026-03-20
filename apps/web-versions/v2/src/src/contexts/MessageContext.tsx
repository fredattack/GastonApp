// src/contexts/MessageContext.tsx
import React, { createContext, useContext, useState } from "react";

interface MessageContextType {
    handelOpenModal: (model: string, viewMode: string, event?: any) => void;
    registerHandelOpenModal: (
        handler: (val: string, event?: any) => void,
    ) => void;
}

// ✅ Créer le contexte
export const MessageContext = createContext<MessageContextType | undefined>(
    undefined,
);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [handelOpenModalFunction, setHandelOpenModalFunction] = useState<
        ((val: string, viewMode: string, event?: any) => void) | null
    >(null);

    // ✅ Permettre à CTAButton d'enregistrer sa fonction
    const registerHandelOpenModal = (
        handler: (val: string, viewMode: string, event?: any) => void,
    ) => {
        setHandelOpenModalFunction(() => handler);
    };

    // ✅ Appel de la fonction enregistrée
    const handelOpenModal = (model: string, viewMode: string, event?: any) => {
        if (handelOpenModalFunction) {
            handelOpenModalFunction(model, viewMode, event);
        } else {
            console.warn("handelOpenModal is not registered yet!");
        }
    };

    return (
        <MessageContext.Provider
            value={{ handelOpenModal, registerHandelOpenModal }}
        >
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage = (): MessageContextType => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessage must be used within a MessageProvider");
    }
    return context;
};
