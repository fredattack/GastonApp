import React from "react";

/**
 * Hero Section - Message d'accueil personnalisé
 * Affiche un message contextuel basé sur l'heure de la journée
 */
const HeroSection: React.FC = () => {
    const getGreeting = (): string => {
        const hour = new Date().getHours();

        if (hour < 12) return "Bonjour";
        if (hour < 18) return "Bon après-midi";
        return "Bonsoir";
    };

    const getTimeEmoji = (): string => {
        const hour = new Date().getHours();

        if (hour < 12) return "☀️";
        if (hour < 18) return "🌤️";
        return "🌙";
    };

    // TODO: Récupérer le vrai nom de l'utilisateur depuis le contexte
    const userName = "Fred";

    return (
        <div className="mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl md:text-5xl">
                        {getTimeEmoji()}
                    </span>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            {getGreeting()}, {userName} !
                        </h1>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                            Comment allez-vous aujourd'hui ?
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
