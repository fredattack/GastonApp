import React from "react";
import { useNavigate } from "react-router-dom";
import { usePets } from "../../contexts/PetsContext";

/**
 * Pet Cards - Aperçu visuel des animaux
 * Affiche les animaux de l'utilisateur sous forme de cartes
 */
const PetCards: React.FC = () => {
    const { pets, isLoading } = usePets();
    const navigate = useNavigate();

    const getSpeciesEmoji = (species?: string): string => {
        const emojiMap: Record<string, string> = {
            dog: "🐕",
            cat: "🐈",
            bird: "🐦",
            rabbit: "🐰",
            fish: "🐠",
            hamster: "🐹",
            turtle: "🐢",
            horse: "🐴",
        };
        return emojiMap[species?.toLowerCase() || ""] || "🐾";
    };

    const calculateAge = (birthDate?: string): string => {
        if (!birthDate) return "Âge inconnu";

        const birth = new Date(birthDate);
        const today = new Date();
        const ageInMonths =
            (today.getFullYear() - birth.getFullYear()) * 12 +
            (today.getMonth() - birth.getMonth());

        if (ageInMonths < 12) {
            return `${ageInMonths} mois`;
        }

        const years = Math.floor(ageInMonths / 12);
        return `${years} an${years > 1 ? "s" : ""}`;
    };

    if (isLoading) {
        return (
            <div className="mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Mes animaux
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="min-w-[140px] md:min-w-[160px] h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (!pets || pets.length === 0) {
        return (
            <div className="mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Mes animaux
                </h2>
                <button
                    onClick={() => navigate("/content/pets/new")}
                    className="
                        w-full p-6
                        bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900
                        border-2 border-dashed border-gray-300 dark:border-gray-700
                        rounded-2xl
                        text-center
                        hover:border-primary dark:hover:border-primary
                        transition-colors duration-200
                    "
                >
                    <div className="text-4xl mb-2">🐾</div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        Aucun animal enregistré
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ajoutez votre premier compagnon
                    </p>
                </button>
            </div>
        );
    }

    return (
        <section className="mb-6 md:mb-8" aria-labelledby="pets-heading">
            <div className="flex items-center justify-between mb-4">
                <h2
                    id="pets-heading"
                    className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white"
                >
                    Mes animaux
                </h2>
                <button
                    onClick={() => navigate("/content/pets")}
                    className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
                    aria-label="Voir tous les animaux"
                    type="button"
                >
                    Voir tout
                </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="list">
                {pets.map((pet) => (
                    <button
                        key={pet.id}
                        onClick={() => navigate(`/content/pets/${pet.id}`)}
                        className="
                            min-w-[140px] md:min-w-[160px]
                            bg-white dark:bg-gray-800
                            rounded-2xl p-4
                            shadow-sm hover:shadow-md
                            transition-all duration-200
                            hover:scale-[1.02] active:scale-[0.98]
                            border border-gray-200 dark:border-gray-700
                            text-left
                            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900
                        "
                        aria-label={`${pet.name}, ${pet.breed || pet.species}, ${calculateAge(pet.birthDate)}`}
                        type="button"
                        role="listitem"
                    >
                        <div className="text-3xl mb-2" aria-hidden="true">
                            {getSpeciesEmoji(pet.species)}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                            {pet.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {pet.breed || pet.species}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {calculateAge(pet.birthDate)}
                        </p>
                    </button>
                ))}

                <button
                    onClick={() => navigate("/content/pets/new")}
                    className="
                        min-w-[140px] md:min-w-[160px]
                        bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900
                        border-2 border-dashed border-gray-300 dark:border-gray-700
                        rounded-2xl p-4
                        flex flex-col items-center justify-center
                        hover:border-primary dark:hover:border-primary
                        transition-colors duration-200
                        min-h-[120px]
                    "
                >
                    <div className="text-3xl mb-2">➕</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        Ajouter
                    </p>
                </button>
            </div>
        </section>
    );
};

export default PetCards;
