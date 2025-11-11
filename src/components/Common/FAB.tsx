import React from "react";
import { useNavigate } from "react-router-dom";

interface FABProps {
    onClick?: () => void;
    icon?: string;
    ariaLabel?: string;
}

/**
 * Floating Action Button - Style Apple
 * Bouton d'action principal flottant en bas à droite
 */
const FAB: React.FC<FABProps> = ({
    onClick,
    icon = "🎤",
    ariaLabel = "Assistant vocal",
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            // Action par défaut : ouvrir l'assistant IA
            navigate("/ai-assistant");
        }
    };

    return (
        <button
            onClick={handleClick}
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
            "
            aria-label={ariaLabel}
        >
            {icon}
        </button>
    );
};

export default FAB;
