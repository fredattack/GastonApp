import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faCakeCandles, faDna, faCat, faDog } from '@fortawesome/free-solid-svg-icons';

interface PetHeroSectionProps {
    petData: PetFormData;
}

const PetHeroSection: React.FC<PetHeroSectionProps> = ({ petData }) => {
    const getSpeciesIcon = () => {
        switch (petData.species) {
            case 'cat':
                return faCat;
            case 'dog':
                return faDog;
            default:
                return faPaw;
        }
    };

    const getSpeciesLabel = () => {
        switch (petData.species) {
            case 'cat':
                return 'Chat';
            case 'dog':
                return 'Chien';
            default:
                return petData.species;
        }
    };

    const calculateAge = (birthDate: string): string => {
        if (!birthDate) return 'Non spécifié';

        const birth = new Date(birthDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - birth.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} mois`;
        } else {
            const years = Math.floor(diffDays / 365);
            const months = Math.floor((diffDays % 365) / 30);
            if (months === 0) {
                return `${years} an${years > 1 ? 's' : ''}`;
            }
            return `${years} an${years > 1 ? 's' : ''} et ${months} mois`;
        }
    };

    return (
        <div className="mt-4">
            {/* Hero Header */}
            <div className="flex items-start gap-4 mb-4">
                {/* Pet Icon/Avatar */}
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center border-2 border-purple-200 dark:border-purple-700">
                    <FontAwesomeIcon
                        icon={getSpeciesIcon()}
                        className="text-3xl text-purple-600 dark:text-purple-400"
                    />
                </div>

                {/* Pet Info */}
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {petData.name || 'Nom non défini'}
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                            <FontAwesomeIcon icon={getSpeciesIcon()} className="text-xs" />
                            {getSpeciesLabel()}
                        </span>
                        {petData.breed && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                <FontAwesomeIcon icon={faDna} className="text-xs" />
                                {petData.breed}
                            </span>
                        )}
                        {petData.isActive && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                Actif
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {/* Birth Date */}
                {petData.birthDate && (
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                            <FontAwesomeIcon icon={faCakeCandles} className="text-xs" />
                            <span className="font-medium">Date de naissance</span>
                        </div>
                        <p className="text-gray-900 dark:text-white font-semibold">
                            {new Date(petData.birthDate).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {calculateAge(petData.birthDate)}
                        </p>
                    </div>
                )}

                {/* Species & Breed Combined */}
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <FontAwesomeIcon icon={faPaw} className="text-xs" />
                        <span className="font-medium">Informations</span>
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold">
                        {getSpeciesLabel()}
                        {petData.breed && ` • ${petData.breed}`}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {petData.isActive ? 'Profil actif' : 'Profil inactif'}
                    </p>
                </div>
            </div>

            {/* Additional Info if needed */}
            {petData.order && (
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Position dans la liste : {petData.order}
                </div>
            )}
        </div>
    );
};

export default PetHeroSection;