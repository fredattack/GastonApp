/**
 * Utilities for transforming AI responses to application data structures
 */

/**
 * Transforms AI response data to EventFormData format
 * @param aiData - The AI response data from the API
 * @returns EventFormData compatible with EventForm component
 */
export function transformAIResponseToEventForm(
    aiData: AIEventData,
): EventFormData {
    // Convert petId from number[] to string (take first pet)
    const petId =
        aiData.petId && aiData.petId.length > 0
            ? aiData.petId[0].toString()
            : "";

    // Transform pets array from AI format to EventFormData format
    const pets: Pet[] = aiData.pets.map((aiPet) => ({
        id: aiPet.id.toString(),
        name: "",
        birthDate: "",
        breed: "",
        created_at: "",
        isActive: true,
        order: 0,
        ownerId: "",
        species: "",
        photo: "",
        galerie: [],
        pivot: [
            {
                id: aiPet.id,
                item: aiPet.pivot.item,
                quantity: aiPet.pivot.quantity,
                notes: aiPet.pivot.notes,
            },
        ],
    }));

    return {
        id: null,
        master_id: null,
        petId,
        type: aiData.type,
        start_date: aiData.start_date,
        title: aiData.title,
        end_date: aiData.end_date || "",
        is_recurring: aiData.is_recurring,
        is_full_day: aiData.is_full_day,
        recurrence: aiData.recurrence || {
            frequency_type: "",
            frequency: 1,
            days: [],
            end_date: "",
            occurrences: 0,
        },
        pets,
        notes: aiData.notes || "",
        is_done: false,
    };
}

/**
 * Get event type label in French
 * @param type - Event type
 * @returns French label for the event type
 */
export function getEventTypeLabel(type: string): string {
    const typeLabels: Record<string, string> = {
        medical: "Médical",
        feeding: "Alimentation",
        appointment: "Rendez-vous",
        training: "Entraînement",
        social: "Social",
    };

    return typeLabels[type] || type;
}

/**
 * Validates if the AI response has all required fields for event creation
 * @param aiData - The AI response data
 * @returns Object with validation result and error message if any
 */
export function validateAIEventData(aiData: AIEventData): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!aiData.title || aiData.title.trim().length === 0) {
        errors.push("Le titre de l'événement est requis");
    }

    if (!aiData.type) {
        errors.push("Le type d'événement est requis");
    }

    if (!aiData.start_date) {
        errors.push("La date de début est requise");
    }

    if (!aiData.petId || aiData.petId.length === 0) {
        errors.push("Au moins un animal doit être sélectionné");
    }

    if (aiData.is_recurring && aiData.recurrence) {
        if (!aiData.recurrence.frequency_type) {
            errors.push("Le type de récurrence est requis");
        }
        if (!aiData.recurrence.end_date && !aiData.recurrence.occurrences) {
            errors.push(
                "La date de fin ou le nombre d'occurrences est requis pour les événements récurrents",
            );
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Extract primary data from event based on event type
 * Returns the 3-4 most important pieces of information for display
 * @param event - The event data
 * @returns Object with primary fields to display
 */
export function extractPrimaryData(event: EventFormData) {
    const baseData = {
        pets: event.pets,
        datetime: event.start_date,
        isRecurring: event.is_recurring,
        isFullDay: event.is_full_day,
    };

    const firstPetPivot = event.pets[0]?.pivot?.[0];

    switch (event.type) {
        case "feeding":
            return {
                ...baseData,
                item: firstPetPivot?.item || "",
                quantity: firstPetPivot?.quantity || "",
                notes: firstPetPivot?.notes || event.notes || "",
            };

        case "medical":
            return {
                ...baseData,
                medication: firstPetPivot?.item || "",
                dosage: firstPetPivot?.quantity || "",
                frequency: event.is_recurring ? "Récurrent" : "Ponctuel",
                notes: firstPetPivot?.notes || event.notes || "",
            };

        case "appointment":
            return {
                ...baseData,
                location: firstPetPivot?.item || "",
                duration: firstPetPivot?.quantity || "",
                notes: firstPetPivot?.notes || event.notes || "",
            };

        case "training":
            return {
                ...baseData,
                activity: firstPetPivot?.item || "",
                duration: firstPetPivot?.quantity || "",
                notes: firstPetPivot?.notes || event.notes || "",
            };

        case "social":
            return {
                ...baseData,
                activity: firstPetPivot?.item || "",
                location: firstPetPivot?.quantity || "",
                notes: firstPetPivot?.notes || event.notes || "",
            };

        default:
            return {
                ...baseData,
                details: firstPetPivot?.item || "",
                notes: firstPetPivot?.notes || event.notes || "",
            };
    }
}
