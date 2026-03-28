declare global {
    interface Action {
        icon: string;
        label: string;
        onClick: () => void;
    }

    interface PetFormData {
        birthDate: string; // YYYY-MM-DD
        breed: string;
        created_at: string; // YYYY-MM-DD hh:ii
        id: string | null; // null if new pet
        isActive: boolean; // default true
        name: string; // unique
        order: number; // last order of pets
        ownerId: string; // auth user id
        species: string | "dog" | "cat";
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
        pivot: PetDetails[];
    }

    interface EventItem {
        type: "medication" | "food" | "prestataire" | "other"; // Type d'entité associée
        id: string; // Identifiant de l'entité
        parent_id: string; // Identifiant de l'entité
        unit: string; //
        quantity: string; // Identifiant de l'entité
        notes: string; // Notes supplémentaires
    }

    interface Event {
        id: string; // Identifiant unique de l'événement
        master_id: string; // Identifiant de l'événement maître (pour les événements récurrents)
        petId: string; // Identifiant de l'animal associé
        title: string; // Titre de l'événement
        is_full_day: boolean; // Indique si l'événement dure toute la journée
        type: "medical" | "feeding" | "appointment" | "training" | "social"; // Type d'événement
        start_date: Date; // Date et heure de début
        end_date?: Date; // Date et heure de fin (facultatif)
        is_recurring: boolean; // Indique si l'événement est récurrent
        recurrence?: Recurrence; // Détails des récurrences
        event_items?: EventItem[]; // Entités associées à l'événement
        notes?: string; // Notes supplémentaires
        created_at: Date; // Date de création
        pets: Pet[]; // Animaux associés
        is_done: boolean;
    }

    interface Recurrence {
        frequency_type: "weekly" | "monthly" | "daily" | string;
        end_date: Date | string;
        occurrences: number;
        frequency: number;
        days: string[];
    }

    interface EventFormData {
        id: string | null;
        master_id: string | null;
        title: string; // Titre de l'événement
        petId: string;
        type: string;
        start_date: Date | string;
        end_date: Date | string;
        is_recurring: boolean;
        is_full_day: boolean;
        recurrence: Recurrence;
        notes: string;
        is_done: boolean;
        pets: Pet[];
    }

    interface PetDetails {
        id: number;
        item: string;
        quantity: string;
        notes: string;
    }

    interface AIEventPivot {
        item: string;
        quantity: string;
        notes: string;
    }

    interface AIEventPet {
        id: number;
        pivot: AIEventPivot;
    }

    interface AIEventData {
        title: string;
        type: string;
        petId: number[];
        start_date: string;
        end_date: string | null;
        is_recurring: boolean;
        is_full_day: boolean;
        pets: AIEventPet[];
        notes: string;
        recurrence?: Recurrence;
    }

    // Health Disclaimer Types
    interface DisclaimerAction {
        label: string;
        type: "primary" | "secondary" | "danger";
        action: "findVet" | "dismiss" | "learnMore" | "callEmergency";
    }

    interface HealthDisclaimer {
        severity: "info" | "warning" | "critical";
        type: "medical" | "nutrition" | "general";
        title: string;
        message: string;
        actions: DisclaimerAction[];
        autoMedicationWarning?: string;
    }

    // AI Response — matches backend AiOrchestratorResponse DTO exactly
    type AIRequestType =
        | "createEvent"
        | "updateEvent"
        | "deleteEvent"
        | "createPet"
        | "updatePet"
        | "deletePet"
        | "query"
        | "advice"
        | "petQuery"
        | "logHealthEvent"
        | "createMetric"
        | "markFeeding"
        | "batchMarkFeeding"
        | "updateFeedingSchedule"
        | "queryDiet"
        | "queryFeedingStatus"
        | "multiAction"
        | "clarification"
        | "error";

    type AIStatus =
        | "executed"
        | "needs_confirmation"
        | "needs_clarification"
        | "low_confidence"
        | "failed"
        | "error";

    interface AIResponse {
        status: AIStatus;
        requestType: AIRequestType;
        description: string;
        confidenceScore: number;
        result?: Record<string, unknown> | Record<string, unknown>[] | null;
        message?: string;
        conversationResponse?: string;
        emotionalTone?: string;
        healthDisclaimer?: HealthDisclaimer;
        petWarning?: {
            title?: string;
            message?: string;
            suggestions?: string[];
            availablePets?: Array<{ id: string; name: string; species: string }>;
        };
        confirmationNeeded?: {
            message: string;
            action?: string;
            summary?: string;
            data?: Record<string, unknown>;
            actions?: Record<string, unknown>[];
        };
        metadata?: Record<string, unknown>;
        failureReason?: string;
    }

    interface AIError {
        error: string;
        message: string;
        code?: string;
    }

    // AI Assistant Conversation Types
    interface MessageAction {
        type: "create" | "edit" | "delete" | "view" | "regenerate";
        label: string;
        icon: string;
        onClick: () => void;
        status?: "pending" | "loading" | "success" | "error";
    }

    interface Message {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
        metadata?: {
            isStreaming?: boolean;
            attachedEvent?: EventFormData | null;
            attachedPet?: PetFormData;
            aiResponse?: AIResponse;
            actions?: MessageAction[];
            error?: string;
        };
    }

    interface Conversation {
        id: string;
        title: string;
        messages: Message[];
        createdAt: Date;
        updatedAt: Date;
        isPinned: boolean;
        tags: string[];
    }

    interface ConversationState {
        conversations: Conversation[];
        activeConversationId: string | null;
        isLoading: boolean;
        streamingMessageId: string | null;
    }

    // Feeding System Types
    interface FeedingSchedule {
        id: number;
        pet_id: number;
        meal_slot: "morning" | "noon" | "evening";
        food_type: string;
        quantity: number;
        unit: string;
        notes: string | null;
        is_active: boolean;
    }

    interface FeedingItem {
        schedule_id: number;
        pet_id: number;
        pet_name: string;
        pet_species: string;
        meal_slot: "morning" | "noon" | "evening";
        food_type: string;
        quantity: number;
        unit: string;
        notes: string | null;
        is_done: boolean;
        fed_at: string | null;
        fed_by: string | null;
        log_id: number | null;
    }

    interface FeedingSlotData {
        items: FeedingItem[];
        total: number;
        done: number;
    }

    interface FeedingTodayResponse {
        date: string;
        slots: {
            morning: FeedingSlotData;
            noon: FeedingSlotData;
            evening: FeedingSlotData;
        };
    }

    type MealSlot = "morning" | "noon" | "evening";

    type VoiceCommandResult = AIResponse;

    interface PetScheduleInfo {
        id: number;
        meal_slot: MealSlot;
        food_type: string;
        quantity: number;
        unit: string;
        notes: string | null;
    }

    interface PetScheduleGroup {
        pet_id: number;
        pet_name: string;
        pet_species: string;
        pet_breed: string;
        schedules: PetScheduleInfo[];
    }
}

// Required to make this a module and avoid errors in a global declaration file
export {};
