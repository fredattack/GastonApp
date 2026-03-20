/**
 * Health Disclaimer Utilities
 * Utilities for detecting medical context and generating health disclaimers
 */

const MEDICAL_KEYWORDS = [
    // Médicaments et traitements
    'médicament',
    'traitement',
    'antibiotique',
    'anti-inflammatoire',
    'vermifuge',
    'antiparasitaire',
    'corticoïde',
    'antidouleur',
    'médicaments',
    'pilule',
    'comprimé',
    'sirop',
    'injection',
    'piqûre',

    // Symptômes
    'symptôme',
    'malade',
    'douleur',
    'vomi',
    'vomissement',
    'diarrhée',
    'fièvre',
    'température',
    'blessure',
    'plaie',
    'saignement',
    'boiterie',
    'toux',
    'éternuement',
    'démangeaison',
    'grattage',

    // Conditions médicales
    'infection',
    'allergie',
    'maladie',
    'diabète',
    'insuffisance',
    'cancer',
    'tumeur',
    'inflammation',
    'arthrose',
    'fracture',
    'entorse',
    'paralysie',

    // Soins vétérinaires
    'vétérinaire',
    'véto',
    'clinique',
    'urgence',
    'consultation',
    'diagnostic',
    'analyse',
    'radio',
    'échographie',
    'opération',
    'chirurgie',
    'hospitalisation',

    // Vaccins et prévention
    'vaccin',
    'vaccination',
    'rappel',
    'immunisation',

    // Autres termes médicaux
    'santé',
    'soigner',
    'guérir',
    'dose',
    'posologie',
    'prescription',
    'ordonnance',
];

const EMERGENCY_KEYWORDS = [
    'urgence',
    'critique',
    'grave',
    'hémorragie',
    'convulsion',
    'inconscient',
    'empoisonnement',
    'intoxication',
    'accident',
    'chute',
    'morsure',
    'électrocution',
    'brûlure',
    'noyade',
    'étouffement',
];

/**
 * Détecte si le contexte est médical en analysant le texte et les données
 */
export function isMedicalContext(
    text: string,
    eventType?: string,
    adviceType?: string,
): boolean {
    // Vérifier le type d'événement
    if (eventType === 'medical') {
        return true;
    }

    // Vérifier le type de conseil
    if (adviceType === 'health') {
        return true;
    }

    // Analyser le texte pour les mots-clés médicaux
    const lowerText = text.toLowerCase();
    return MEDICAL_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

/**
 * Détecte si c'est une situation d'urgence
 */
export function isEmergencyContext(text: string): boolean {
    const lowerText = text.toLowerCase();
    return EMERGENCY_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

/**
 * Génère un disclaimer de santé approprié
 */
export function generateHealthDisclaimer(
    text: string,
    eventType?: string,
    adviceType?: string,
): HealthDisclaimer | null {
    if (!isMedicalContext(text, eventType, adviceType)) {
        return null;
    }

    const isEmergency = isEmergencyContext(text);

    if (isEmergency) {
        return {
            severity: 'critical',
            type: 'medical',
            title: '🚨 Urgence Vétérinaire',
            message:
                "Cette situation pourrait être une urgence vétérinaire. N'attendez pas et contactez immédiatement un vétérinaire ou une clinique d'urgence.",
            actions: [
                {
                    label: 'Appeler Urgences',
                    type: 'danger',
                    action: 'callEmergency',
                },
                {
                    label: 'Trouver un vétérinaire',
                    type: 'primary',
                    action: 'findVet',
                },
                {
                    label: "J'ai compris",
                    type: 'secondary',
                    action: 'dismiss',
                },
            ],
            autoMedicationWarning:
                "⚠️ Ne donnez jamais de médicaments à votre animal sans prescription vétérinaire. L'automédication peut être dangereuse, voire mortelle.",
        };
    }

    return {
        severity: 'warning',
        type: eventType === 'medical' ? 'medical' : 'general',
        title: '⚠️ Avertissement Santé',
        message:
            "Les informations fournies par GastonApp ne remplacent en aucun cas l'avis d'un vétérinaire professionnel. En cas de doute sur la santé de votre animal, consultez immédiatement un vétérinaire.",
        actions: [
            {
                label: 'Trouver un vétérinaire',
                type: 'primary',
                action: 'findVet',
            },
            {
                label: 'En savoir plus',
                type: 'secondary',
                action: 'learnMore',
            },
            {
                label: "J'ai compris",
                type: 'secondary',
                action: 'dismiss',
            },
        ],
        autoMedicationWarning:
            "⚠️ Ne donnez jamais de médicaments à votre animal sans prescription vétérinaire. L'automédication peut être dangereuse, voire mortelle.",
    };
}

/**
 * Enrichit une réponse AI avec un disclaimer si nécessaire
 */
export function enrichWithHealthDisclaimer(
    response: AIResponse,
    originalPrompt: string,
): AIResponse {
    // Vérifier si un disclaimer est déjà présent
    if (response.healthDisclaimer) {
        return response;
    }

    // Déterminer le type d'événement ou de conseil
    const eventType =
        'type' in response.data ? (response.data as any).type : undefined;
    const adviceType =
        'adviceType' in response.data
            ? (response.data as any).adviceType
            : undefined;

    // Combiner le prompt original et la description pour l'analyse
    const textToAnalyze = `${originalPrompt} ${response.description}`;

    // Générer le disclaimer si nécessaire
    const disclaimer = generateHealthDisclaimer(
        textToAnalyze,
        eventType,
        adviceType,
    );

    if (disclaimer) {
        return {
            ...response,
            healthDisclaimer: disclaimer,
            metadata: {
                ...response.metadata,
                hasMedicalContext: true,
                originalPrompt,
                processedAt: new Date().toISOString(),
            },
        };
    }

    return response;
}
