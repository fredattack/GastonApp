import React from "react";

interface FABProps {
    onClick?: () => void;
    icon?: string;
    ariaLabel?: string;
}

/**
 * Floating Action Button - Style Apple
 * Bouton d'action principal flottant en bas à droite
 * Opens AI Command Bar by default
 */
const FAB: React.FC<FABProps> = ({
    onClick,
    icon = "✨",
    ariaLabel = "AI Assistant",
}) => {
    return (
        <button
            onClick={onClick}
            className="
                fixed bottom-6 right-6 z-50
                w-16 h-16
                bg-primary hover:bg-primary/90
                text-white text-2xl
                rounded-full
                shadow-lg hover:shadow-xl
                transition-all duration-300
                active:scale-95
                flex items-center justify-center
                md:bottom-8 md:right-8
                lg:bottom-24 lg:right-8
                focus:outline-none focus:ring-4 focus:ring-primary/50
            "
            aria-label={ariaLabel}
            title={ariaLabel}
            type="button"
        >
            <span aria-hidden="true">{icon}</span>
        </button>
    );
};

export default FAB;
