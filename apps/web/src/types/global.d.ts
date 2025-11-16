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
        type: 'primary' | 'secondary' | 'danger';
        action: 'findVet' | 'dismiss' | 'learnMore' | 'callEmergency';
    }

    interface HealthDisclaimer {
        severity: 'info' | 'warning' | 'critical';
        type: 'medical' | 'nutrition' | 'general';
        title: string;
        message: string;
        actions: DisclaimerAction[];
        autoMedicationWarning?: string;
    }

    interface AIResponseMetadata {
        hasMedicalContext: boolean;
        processedAt: string;
        originalPrompt?: string;
        confidence?: number;
    }

    // Query Response Types
    interface QueryResult {
        queryType: 'events' | 'pets' | 'statistics' | 'history';
        results: Event[] | Pet[] | any[];
        totalCount: number;
        filters?: {
            petIds?: string[];
            startDate?: string;
            endDate?: string;
            eventTypes?: string[];
        };
        summary?: string;
    }

    // Advice Response Types
    interface AdviceData {
        adviceType: 'nutrition' | 'health' | 'behavior' | 'general';
        question: string;
        answer: string;
        sources?: string[];
        relatedTopics?: string[];
        confidence: number;

        // Nutrition-specific fields
        species?: 'dog' | 'cat' | string;
        weight?: number;
        age?: 'puppy' | 'kitten' | 'adult' | 'senior' | string;
        dailyCalories?: number;
        feedingFrequency?: string;
        toxicFoods?: string[];

        // Health-specific fields
        symptom?: string;
        severity?: 'low' | 'medium' | 'high' | 'unknown';
        redFlags?: string[];
        nextSteps?: string[];
    }

    // Metrics Response Types
    interface Metric {
        id?: string;
        pet_id: string;
        metric_type: 'weight' | 'temperature' | 'heart_rate' | 'custom';
        value: number;
        unit: string;
        measured_at: string;
        notes?: string;
    }

    interface MetricsAnalysis {
        average: number;
        min: number;
        max: number;
        change: number;
        changePercent: number;
        trend: 'increasing' | 'decreasing' | 'stable';
    }

    interface MetricsHistory {
        metrics: Metric[];
        analysis: MetricsAnalysis;
        petId: string;
        metricType: string;
        startDate?: string;
        endDate?: string;
    }

    // Legacy MetricData for single metric entry
    interface MetricData {
        metricType: 'weight' | 'height' | 'activity' | 'custom';
        petId: string;
        value: number;
        unit: string;
        timestamp: string;
        notes?: string;
    }

    // Delete Operations Types
    interface DeleteFilters {
        petIds?: string[];
        type?: string;
        startDate?: string;
        endDate?: string;
        eventId?: string;
    }

    interface DeleteData {
        filters: DeleteFilters;
        confirmationRequired: boolean;
        itemsToDelete?: Array<{
            id: string;
            title: string;
            type?: string;
            date?: string;
        }>;
        estimatedCount?: number;
    }

    interface AIResponse {
        score: number;
        requestType: "createEvent" | "updateEvent" | "deleteEvent" | "createPet" | "updatePet" | "deletePet" | "query" | "advice" | "metrics";
        description: string;
        data: AIEventData | PetFormData | QueryResult | AdviceData | MetricData | MetricsHistory | DeleteData;
        metadata?: AIResponseMetadata;
        healthDisclaimer?: HealthDisclaimer;
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
}

// Required to make this a module and avoid errors in a global declaration file
export {};
