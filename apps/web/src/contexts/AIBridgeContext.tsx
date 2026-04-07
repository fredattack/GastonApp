import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";

interface PendingInjection {
    type: "question" | "command" | "redirect";
    payload: {
        query: string;
        aiResponse?: AIResponse;
    };
}

interface AIBridgeContextValue {
    pendingInjection: PendingInjection | null;
    inject: (injection: PendingInjection) => void;
    clear: () => void;
}

const AIBridgeContext = createContext<AIBridgeContextValue | null>(null);

interface AIBridgeProviderProps {
    children: ReactNode;
}

export const AIBridgeProvider: React.FC<AIBridgeProviderProps> = ({
    children,
}) => {
    const [pendingInjection, setPendingInjection] =
        useState<PendingInjection | null>(null);

    const inject = useCallback((injection: PendingInjection) => {
        setPendingInjection(injection);
    }, []);

    const clear = useCallback(() => {
        setPendingInjection(null);
    }, []);

    return (
        <AIBridgeContext.Provider value={{ pendingInjection, inject, clear }}>
            {children}
        </AIBridgeContext.Provider>
    );
};

export const useAIBridge = (): AIBridgeContextValue => {
    const context = useContext(AIBridgeContext);
    if (!context) {
        throw new Error("useAIBridge must be used within AIBridgeProvider");
    }
    return context;
};
