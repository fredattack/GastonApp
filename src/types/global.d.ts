declare global {
    interface Action {
        icon: string;
        label: string;
        onClick: () => void;
    }

    interface Pet {
        birthDate: string;
        breed: string;
        created_at: string;
        id: string;
        isActive: boolean;
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
        created_at: string; // YYYY-MM-DD hh:ii
        id: ?string; // null if new pet
        isActive: boolean; // default true
        name: string; // unique
        order: number;  // last order of pets
        ownerId: string; //auth user id
        species: string | 'dog' | 'cat' ;
    }


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
        is_recurring: boolean; // Indique si l'événement est récurrent
        recurrence?: Recurrence; // Détails des récurrences
        eventItems?: EventItem[]; // Entités associées à l'événement
        notes?: string; // Notes supplémentaires
        created_at: Date; // Date de création
    };

    interface Recurrence {
        frequency_type: 'weekly' | 'monthly' | 'daily' | string;
        end_date: Date | string;
        occurences:number
        frequency: number;
        days: string[];
    }

    interface EventFormData {
        id: ?string,
        title: string; // Titre de l'événement
        petId: string;
        type: string;
        start_date: Date | string;
        end_date: Date | string;
        is_recurring: boolean;
        is_full_day: boolean;
        recurrence: Recurrence;
        notes: string
    }

}

// Required to make this a module and avoid errors in a global declaration file
export {};
