/**
 * Client-Side Knowledge Base
 * Provides basic nutrition and health advice when backend is unavailable
 */

interface NutritionKnowledge {
    daily_calories: {
        formula: string;
        adjustments: Record<string, number>;
    };
    toxic_foods: string[];
    feeding_frequency: Record<string, string>;
}

interface HealthSymptomInfo {
    severity: 'low' | 'medium' | 'high';
    advice: string;
    redFlags: string[];
    nextSteps: string[];
}

const NUTRITION_KNOWLEDGE: Record<string, NutritionKnowledge> = {
    dog: {
        daily_calories: {
            formula: 'weight_kg * 30 + 70',
            adjustments: {
                puppy: 2.0,
                adult: 1.0,
                senior: 0.8,
                active: 1.2,
                inactive: 0.9,
            },
        },
        toxic_foods: [
            'chocolat',
            'raisins',
            'raisins secs',
            'oignons',
            'ail',
            'avocat',
            'xylitol',
            'caféine',
            'alcool',
            'noix de macadamia',
            'os cuits',
            'pâte crue',
        ],
        feeding_frequency: {
            puppy: '3-4 fois par jour',
            adult: '2 fois par jour',
            senior: '2 fois par jour',
        },
    },
    cat: {
        daily_calories: {
            formula: 'weight_kg * 70',
            adjustments: {
                kitten: 2.5,
                adult: 1.0,
                senior: 0.8,
                active: 1.1,
                inactive: 0.8,
            },
        },
        toxic_foods: [
            'chocolat',
            'oignons',
            'ail',
            'raisins',
            'raisins secs',
            'lait',
            'poisson cru',
            'œufs crus',
            'caféine',
            'alcool',
            'thon en conserve',
            'os',
        ],
        feeding_frequency: {
            kitten: '4 fois par jour',
            adult: '2-3 fois par jour',
            senior: '2 fois par jour',
        },
    },
};

const HEALTH_SYMPTOMS: Record<string, HealthSymptomInfo> = {
    vomit: {
        severity: 'medium',
        advice:
            "Les vomissements occasionnels peuvent être normaux, mais surveillez votre animal. Si les vomissements persistent plus de 24h, contiennent du sang, ou sont accompagnés d'autres symptômes, consultez immédiatement un vétérinaire.",
        redFlags: [
            'Sang dans les vomissements',
            'Plus de 24h de vomissements',
            'Léthargie',
            'Refus de boire',
            'Abdomen gonflé',
        ],
        nextSteps: [
            'Retirer la nourriture pendant 12h',
            "Proposer de l'eau en petites quantités",
            'Surveiller le comportement',
            'Consulter un vétérinaire si persistance',
        ],
    },
    diarrhea: {
        severity: 'medium',
        advice:
            'La diarrhée peut avoir plusieurs causes. Une diarrhée légère peut se résoudre en 24-48h. Si elle persiste, contient du sang, ou votre animal semble déshydraté, consultez un vétérinaire.',
        redFlags: [
            'Sang dans les selles',
            'Déshydratation',
            'Plus de 48h',
            'Fièvre',
            'Perte de poids rapide',
        ],
        nextSteps: [
            'Maintenir une bonne hydratation',
            'Diète légère (riz + poulet)',
            'Éviter les produits laitiers',
            'Consulter si persistance ou aggravation',
        ],
    },
    fever: {
        severity: 'high',
        advice:
            "La fièvre est un signe que le corps combat une infection. Une température normale pour un chien est de 38-39°C, et pour un chat 38-39.2°C. Au-dessus de 39.5°C, consultez un vétérinaire rapidement.",
        redFlags: [
            'Température > 40°C',
            'Léthargie sévère',
            'Refus de boire',
            'Tremblements',
            'Difficulté respiratoire',
        ],
        nextSteps: [
            'Mesurer la température rectale',
            'Maintenir au frais sans refroidir brutalement',
            'Encourager à boire',
            'Consulter un vétérinaire rapidement',
        ],
    },
    cough: {
        severity: 'medium',
        advice:
            "La toux peut être causée par diverses raisons : irritation, infection, allergie, ou problème cardiaque. Une toux occasionnelle n'est pas alarmante, mais une toux persistante nécessite une consultation vétérinaire.",
        redFlags: [
            'Toux avec sang',
            'Difficulté respiratoire',
            'Toux nocturne',
            'Perte de poids',
            'Fatigue excessive',
        ],
        nextSteps: [
            'Noter la fréquence et le type de toux',
            'Vérifier la présence de mucus',
            'Éviter les irritants (fumée, poussière)',
            'Consulter si persistance > 1 semaine',
        ],
    },
    limping: {
        severity: 'medium',
        advice:
            "La boiterie peut résulter d'une blessure, arthrite, ou problème articulaire. Si la boiterie est soudaine et sévère, consultez rapidement. Pour une boiterie légère, surveillez 24-48h.",
        redFlags: [
            'Impossibilité de poser la patte',
            'Gonflement visible',
            'Douleur au toucher',
            'Fièvre associée',
            'Patte pendante',
        ],
        nextSteps: [
            'Limiter les mouvements et exercice',
            'Examiner la patte pour blessures',
            'Appliquer du froid si gonflement (15 min)',
            'Consulter si pas d\'amélioration en 48h',
        ],
    },
};

/**
 * Calculate daily calorie needs for a pet
 */
export function calculateDailyCalories(
    species: 'dog' | 'cat',
    weight: number,
    age: 'puppy' | 'kitten' | 'adult' | 'senior' = 'adult',
): number {
    const knowledge = NUTRITION_KNOWLEDGE[species];
    if (!knowledge) return 0;

    // Calculate base calories
    let baseCalories: number;
    if (species === 'dog') {
        baseCalories = weight * 30 + 70;
    } else {
        baseCalories = weight * 70;
    }

    // Apply age adjustment
    const adjustment = knowledge.daily_calories.adjustments[age] || 1.0;
    return Math.round(baseCalories * adjustment);
}

/**
 * Get nutrition advice for a pet
 */
export function getNutritionAdvice(
    species: 'dog' | 'cat',
    weight: number,
    age: 'puppy' | 'kitten' | 'adult' | 'senior' = 'adult',
): AdviceData {
    const knowledge = NUTRITION_KNOWLEDGE[species];
    if (!knowledge) {
        return {
            adviceType: 'nutrition',
            question: `Nutrition pour ${species}`,
            answer: 'Informations non disponibles pour cette espèce.',
            confidence: 0,
        };
    }

    const dailyCalories = calculateDailyCalories(species, weight, age);
    const feedingFrequency = knowledge.feeding_frequency[age];

    const animalType = species === 'dog' ? 'chien' : 'chat';
    const ageLabel =
        age === 'puppy' || age === 'kitten'
            ? 'jeune'
            : age === 'senior'
              ? 'âgé'
              : 'adulte';

    return {
        adviceType: 'nutrition',
        species,
        weight,
        age,
        question: `Quelle quantité de nourriture pour un ${animalType} de ${weight} kg ?`,
        answer: `Pour un ${animalType} ${ageLabel} de ${weight} kg, l'apport calorique quotidien recommandé est d'environ ${dailyCalories} calories. Répartissez cet apport sur ${feedingFrequency}.`,
        dailyCalories,
        feedingFrequency,
        toxicFoods: knowledge.toxic_foods,
        confidence: 85,
        sources: [
            'https://www.akc.org/expert-advice/nutrition/',
            'https://www.aspca.org/pet-care/general-pet-care/nutrition-tips',
        ],
        relatedTopics: [
            'Alimentation équilibrée',
            'Suppléments nutritionnels',
            'Gestion du poids',
        ],
    };
}

/**
 * Get health advice for a symptom
 */
export function getHealthAdvice(symptom: string): AdviceData {
    const symptomKey = symptom.toLowerCase();

    // Try to match symptom
    let info: HealthSymptomInfo | undefined;
    for (const [key, value] of Object.entries(HEALTH_SYMPTOMS)) {
        if (
            symptomKey.includes(key) ||
            key.includes(symptomKey) ||
            (key === 'vomit' && symptomKey.includes('vomi')) ||
            (key === 'diarrhea' && symptomKey.includes('diarrhée')) ||
            (key === 'fever' && symptomKey.includes('fièvre')) ||
            (key === 'cough' && symptomKey.includes('toux')) ||
            (key === 'limping' && symptomKey.includes('boite'))
        ) {
            info = value;
            break;
        }
    }

    if (!info) {
        return {
            adviceType: 'health',
            question: `Symptôme: ${symptom}`,
            answer:
                "Pour tout problème de santé, nous recommandons vivement de consulter un vétérinaire. Seul un professionnel peut établir un diagnostic précis et prescrire un traitement approprié.",
            severity: 'unknown',
            confidence: 50,
            nextSteps: [
                'Surveiller l\'évolution des symptômes',
                'Noter tous les changements de comportement',
                'Consulter un vétérinaire rapidement',
            ],
        };
    }

    return {
        adviceType: 'health',
        question: `Symptôme: ${symptom}`,
        answer: info.advice,
        severity: info.severity,
        redFlags: info.redFlags,
        nextSteps: info.nextSteps,
        confidence: 80,
        sources: [
            'https://www.akc.org/expert-advice/health/',
            'https://www.aspca.org/pet-care/general-pet-care/first-aid',
        ],
        relatedTopics: ['Urgences vétérinaires', 'Premiers soins', 'Santé préventive'],
    };
}

/**
 * Get list of toxic foods for a species
 */
export function getToxicFoods(species: 'dog' | 'cat'): string[] {
    return NUTRITION_KNOWLEDGE[species]?.toxic_foods || [];
}

/**
 * Check if a food is toxic for a species
 */
export function isFoodToxic(
    food: string,
    species: 'dog' | 'cat',
): boolean {
    const toxicFoods = getToxicFoods(species);
    const foodLower = food.toLowerCase();
    return toxicFoods.some((toxic) =>
        foodLower.includes(toxic.toLowerCase()),
    );
}
