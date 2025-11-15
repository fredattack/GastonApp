/**
 * Transforme les données de l'IA en format de formulaire d'événement
 */
export function transformAIResponseToEventForm(
    data: AIEventData,
): EventFormData {
    return {
        id: null,
        master_id: null,
        title: data.title || "",
        petId: data.petId?.[0]?.toString() || "",
        type: data.type || "",
        start_date: data.start_date || new Date().toISOString(),
        end_date: data.end_date || data.start_date || new Date().toISOString(),
        is_recurring: data.is_recurring || false,
        is_full_day: data.is_full_day || false,
        recurrence: data.recurrence || {
            frequency_type: "daily",
            frequency: 1,
            end_date: "",
            occurrences: 0,
            days: [],
        },
        notes: data.notes || "",
        is_done: false,
        pets:
            data.pets?.map((aiPet) => ({
                id: aiPet.id.toString(),
                name: "",
                species: "",
                breed: "",
                birthDate: "",
                ownerId: "",
                created_at: new Date().toISOString(),
                isActive: true,
                order: 0,
                photo: "",
                galerie: [],
                pivot: Array.isArray(aiPet.pivot) ? aiPet.pivot as unknown as PetDetails[] : [aiPet.pivot as unknown as PetDetails],
            })) || [],
    };
}

/**
 * Retourne le label français pour un type d'événement
 */
export function getEventTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        feeding: "Alimentation",
        medical: "Médical",
        appointment: "Rendez-vous",
        training: "Entraînement",
        social: "Social",
        grooming: "Toilettage",
        walk: "Promenade",
        other: "Autre",
    };

    return labels[type] || type;
}

/**
 * Extrait les données primaires d'un événement selon son type
 * Utilisé pour l'affichage prioritaire dans les cartes
 */
export function extractPrimaryData(event: EventFormData) {
    const baseData = {
        pets: event.pets || [],
        datetime: event.start_date,
        isRecurring: event.is_recurring,
        isFullDay: event.is_full_day,
    };

    const firstPetPivot = Array.isArray(event.pets?.[0]?.pivot)
        ? event.pets[0].pivot[0]
        : event.pets?.[0]?.pivot;

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
                location: event.notes || "",
                duration: "",
                notes: event.notes || "",
            };

        case "training":
        case "social":
            return {
                ...baseData,
                activity: event.title || "",
                duration: "",
                notes: event.notes || "",
            };

        default:
            return {
                ...baseData,
                details: event.notes || event.title || "",
                notes: event.notes || "",
            };
    }
}
