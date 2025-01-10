declare global {
    interface Action {
        icon: string;
        label: string;
        onClick: () => void;
    }

    interface Pet {
        birthDate: string;
        breed: string;
        createdAt: string;
        id: string;
        is_active: boolean;
        name: string;
        order: number;
        ownerId: string;
        species: string;
        photo: string;
        galerie: string[];
    }

    interface PetFormData {
        birthDate: string; // YYYY-MM-DD
        breed: string;
        createdAt: string; // YYYY-MM-DD hh:ii
        id: ?string; // null if new pet
        is_active: boolean; // default true
        name: string; // unique
        order: number;  // last order of pets
        ownerId: string; //auth user id
        species:  'dog' | 'cat' ;
    }

    interface Recurrence {
        frequencyType: 'weekly' | 'monthly' | 'daily'; // Fréquence de l'événement
        frequency: number; // 1: chaque semaine, 2: toutes les deux semaines, etc.
        days?: string[]; // Jours de la semaine, e.g., ["Monday", "Wednesday"]
        endDate?: Date; // Date de fin pour les événements récurrents
    };

    interface EventItem {
        type: 'medication' | 'food' | 'prestataire' | 'other'; // Type d'entité associée
        id: string; // Identifiant de l'entité
        parent_id: string; // Identifiant de l'entité
        unit: string; //
        quantity: string; // Identifiant de l'entité
        notes: string; // Notes supplémentaires
    };

    interface Event {
        id: string; // Identifiant unique de l'événement
        petId: string; // Identifiant de l'animal associé
        title: string; // Titre de l'événement
        isFullDay: boolean; // Indique si l'événement dure toute la journée
        type: 'medical' | 'feeding' | 'appointment' | 'training' | 'social'; // Type d'événement
        startDate: Date; // Date et heure de début
        endDate?: Date; // Date et heure de fin (facultatif)
        isRecurring: boolean; // Indique si l'événement est récurrent
        recurrence?: Recurrence; // Détails des récurrences
        eventItems?: EventItem[]; // Entités associées à l'événement
        notes?: string; // Notes supplémentaires
        createdAt: Date; // Date de création
    };

    interface Recurrence {
        frequencyType: 'weekly' | 'monthly' | 'daily' | string;
        hasEndRecurrence: boolean;
        endRecurrenceDate: Date | string;
        frequency: number;
        days: string[];
    }

    interface EventFormData {
        id: ?string,
        title: string; // Titre de l'événement
        petId: string;
        type: string;
        startDate: Date | string;
        endDate: Date | string;
        isRecurring: boolean;
        isFullDay: boolean;
        recurrence: {
            frequencyType: 'weekly' | 'monthly' | 'daily' | string;
            hasEndRecurrence: boolean;
            endRecurrenceDate: Date | string;
            frequency: number;
            days: string[];
        };
        notes: string

    }

}

// Required to make this a module and avoid errors in a global declaration file
export {};
