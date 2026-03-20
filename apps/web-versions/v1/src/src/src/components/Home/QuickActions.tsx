import React from "react";
import { useNavigate } from "react-router-dom";

interface QuickAction {
    id: string;
    emoji: string;
    title: string;
    description: string;
    path: string;
    color: string;
}

/**
 * Quick Actions - Cartes d'actions rapides
 * 4 grandes cartes pour accéder rapidement aux fonctionnalités principales
 */
const QuickActions: React.FC = () => {
    const navigate = useNavigate();

    const actions: QuickAction[] = [
        {
            id: "add-event",
            emoji: "📅",
            title: "Nouvel événement",
            description: "Planifier une activité",
            path: "/events/new",
            color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
        },
        {
            id: "add-pet",
            emoji: "🐾",
            title: "Ajouter un animal",
            description: "Enregistrer un nouveau compagnon",
            path: "/content/pets/new",
            color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
        },
        {
            id: "calendar",
            emoji: "📆",
            title: "Calendrier",
            description: "Voir tous les événements",
            path: "/",
            color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
        },
        {
            id: "ai-assistant",
            emoji: "🎤",
            title: "Assistant IA",
            description: "Créer avec la voix",
            path: "/ai-assistant",
            color: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
        },
    ];

    return (
        <section
            className="mb-6 md:mb-8"
            aria-labelledby="quick-actions-heading"
        >
            <h2
                id="quick-actions-heading"
                className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4"
            >
                Actions rapides
            </h2>

            <div
                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
                role="group"
            >
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => navigate(action.path)}
                        className={`
                            bg-gradient-to-br ${action.color}
                            rounded-2xl p-4 md:p-6
                            text-left
                            transition-all duration-200
                            hover:scale-[1.02] active:scale-[0.98]
                            shadow-sm hover:shadow-md
                            min-h-[120px] md:min-h-[140px]
                            flex flex-col justify-between
                            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900
                        `}
                        aria-label={`${action.title}: ${action.description}`}
                        type="button"
                    >
                        <div>
                            <div
                                className="text-3xl md:text-4xl mb-2"
                                aria-hidden="true"
                            >
                                {action.emoji}
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base mb-1">
                                {action.title}
                            </h3>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                        </p>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default QuickActions;
