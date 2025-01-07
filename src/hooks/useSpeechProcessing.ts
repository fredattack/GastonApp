import { useCallback } from 'react';

// Exemple de fonction pour traiter le texte vocal
export const useSpeechProcessing = () => {
    const processSpeech = useCallback((text: string) => {
        console.log("Texte traité : ", text);

        // Exemple : Extraction de données avec regex
        const regex = /(\w+)\s+mange\s+tous\s+les\s+jours\s+(\w+)\s+à\s+(\d+h)/i;
        const match = text.match(regex);

        if (match) {
            const [_, petName, food, time] = match;
            console.log(`Animal : ${petName}, Nourriture : ${food}, Heure : ${time}`);
            return { petName, food, time };
        } else {
            console.warn("Impossible d'extraire les informations.");
            return null;
        }
    }, []);

    return { processSpeech };
};
