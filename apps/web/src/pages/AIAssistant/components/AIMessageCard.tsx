import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { usePets } from "../../../contexts/PetsContext";
import { extractPrimaryData } from "../../../utils/aiTransformers";
import EventForm from "../../../components/Event/Form/EventForm";
import IntentHeader from "./IntentHeader";
import EventHeroSection from "./EventHeroSection";
import ContextualActions from "./ContextualActions";
import SecondaryDetails from "./SecondaryDetails";
import { modelService } from "../../../services";
import { useToast } from "../../../providers/ToastProvider";
import HealthDisclaimer from "../../../components/AI/HealthDisclaimer";
import QueryResults from "../../../components/AI/QueryResults";
import AdviceCard from "../../../components/AI/AdviceCard";

interface AIMessageCardProps {
    message: Message;
    aiResponse?: AIResponse;
    onEventCreated?: () => void;
}

const AIMessageCard: React.FC<AIMessageCardProps> = ({
    message,
    aiResponse,
    onEventCreated,
}) => {
    const { pets } = usePets();
    const { addToast } = useToast();
    const { attachedEvent, isStreaming } = message.metadata || {};
    const [mode, setMode] = useState<"preview" | "edit">("preview");
    const [isCreating, setIsCreating] = useState(false);

    // Get requestType from AI response
    const requestType = aiResponse?.requestType || "createEvent";
    const isQuery = requestType === 'query';
    const isAdvice = requestType === 'advice';
    const isEvent = requestType?.includes('Event');

    // For query and advice, we don't need attachedEvent
    if (!attachedEvent && !isQuery && !isAdvice) {
        return null;
    }

    const getPetInfo = () => {
        if (!attachedEvent || !attachedEvent.pets || attachedEvent.pets.length === 0) {
            return [];
        }

        return attachedEvent.pets.map((eventPet) => {
            // Essayer de trouver le pet dans le contexte, sinon utiliser directement eventPet
            const contextPet = pets.find(
                (p) => p.id === eventPet.id.toString(),
            );
            const pet = contextPet || eventPet;

            return {
                pet,
                quantity: eventPet.pivot?.[0]?.quantity || "",
                item: eventPet.pivot?.[0]?.item || "",
                notes: eventPet.pivot?.[0]?.notes || "",
            };
        });
    };

    const handleCreateEvent = async () => {
        if (!attachedEvent) return;

        setIsCreating(true);
        try {
            if (!attachedEvent.type || !attachedEvent.start_date) {
                addToast({
                    message:
                        "Les champs Type et Date de début sont obligatoires !",
                    type: "error",
                });
                setIsCreating(false);
                return;
            }

            // Enrichir l'événement avec les vraies données des animaux
            // et transformer pivot de tableau à objet pour l'API
            const enrichedEvent = {
                ...attachedEvent,
                pets: attachedEvent.pets.map((eventPet) => {
                    const pet = pets.find(
                        (p) => p.id === eventPet.id.toString(),
                    );
                    // Extraire les données pivot du premier élément du tableau
                    const pivotData: PetDetails =
                        Array.isArray(eventPet.pivot) &&
                        eventPet.pivot.length > 0
                            ? eventPet.pivot[0]
                            : (eventPet.pivot as unknown as PetDetails);

                    return {
                        id: eventPet.id,
                        name: pet?.name || eventPet.name,
                        species: pet?.species || eventPet.species,
                        breed: pet?.breed || eventPet.breed,
                        birthDate: pet?.birthDate || eventPet.birthDate,
                        ownerId: pet?.ownerId || eventPet.ownerId,
                        // Transformer pivot en objet si c'est un tableau
                        pivot: {
                            item: pivotData?.item || "",
                            quantity: pivotData?.quantity || "",
                            notes: pivotData?.notes || "",
                        },
                    };
                }),
            };

            await modelService.add("events", enrichedEvent);

            addToast({
                message: "Événement créé avec succès !",
                type: "success",
            });

            if (onEventCreated) {
                onEventCreated();
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'événement :", error);
            addToast({
                message:
                    "Une erreur est survenue lors de la création de l'événement.",
                type: "error",
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleEditEvent = () => {
        setMode("edit");
    };

    const handleBackToPreview = () => {
        setMode("preview");
    };

    const handleEventSubmitted = () => {
        if (onEventCreated) {
            onEventCreated();
        }
        setMode("preview");
    };

    const handleDisclaimerAction = (action: string) => {
        switch (action) {
            case 'findVet':
                // TODO: Open veterinary search modal (Phase 3)
                console.log('Finding vet...');
                addToast({
                    message: 'Recherche de vétérinaires - Fonctionnalité à venir',
                    type: 'info',
                });
                break;
            case 'callEmergency':
                // Open emergency numbers
                if (window.confirm('Voulez-vous appeler les urgences vétérinaires ?')) {
                    window.open('tel:112', '_self');
                }
                break;
            case 'learnMore':
                // TODO: Open health info modal
                console.log('Learn more about health...');
                addToast({
                    message: 'Plus d\'informations santé - Fonctionnalité à venir',
                    type: 'info',
                });
                break;
            case 'dismiss':
                // Dismissed - could save to localStorage
                console.log('Disclaimer dismissed');
                break;
            default:
                break;
        }
    };

    // Extract primary data for display
    const primaryData = attachedEvent ? extractPrimaryData(attachedEvent) : null;
    const petInfo = getPetInfo();

    const score = aiResponse?.score;
    const description =
        message.content || aiResponse?.description || "Génération en cours...";

    return (
        <div className="flex gap-3 mb-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <FontAwesomeIcon icon={faRobot} size="sm" />
            </div>

            <div className="flex-1 max-w-[85%]">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    {/* Health Disclaimer - Always show first if present */}
                    {!isStreaming && aiResponse?.healthDisclaimer && (
                        <HealthDisclaimer
                            disclaimer={aiResponse.healthDisclaimer}
                            onAction={handleDisclaimerAction}
                        />
                    )}

                    {/* Streaming indicator or content */}
                    {isStreaming && !attachedEvent && (
                        <div className="text-sm text-gray-900 dark:text-white leading-relaxed mb-3">
                            {description}
                            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                        </div>
                    )}

                    {/* Description - Always show for non-event types */}
                    {!isStreaming && (isQuery || isAdvice) && description && (
                        <p className="text-sm text-gray-900 dark:text-white leading-relaxed mb-3">
                            {description}
                        </p>
                    )}

                    {/* Query Results */}
                    {!isStreaming && isQuery && aiResponse?.data && (
                        <QueryResults queryResult={aiResponse.data as QueryResult} />
                    )}

                    {/* Advice Card */}
                    {!isStreaming && isAdvice && aiResponse?.data && (
                        <AdviceCard adviceData={aiResponse.data as AdviceData} />
                    )}

                    {/* Event Preview Mode */}
                    {!isStreaming && isEvent && attachedEvent && mode === "preview" && (
                        <>
                            {/* Intent Header */}
                            <IntentHeader
                                requestType={requestType}
                                eventType={attachedEvent.type}
                                description={description}
                                score={score}
                            />

                            {/* Hero Section - Primary Information */}
                            <EventHeroSection
                                eventType={attachedEvent.type}
                                pets={petInfo}
                                primaryData={primaryData}
                            />

                            {/* Secondary Details (Collapsible) */}
                            <SecondaryDetails event={attachedEvent} />

                            {/* Contextual Actions */}
                            <div className="mt-4">
                                <ContextualActions
                                    requestType={requestType}
                                    onConfirm={handleCreateEvent}
                                    onEdit={handleEditEvent}
                                    isLoading={isCreating}
                                />
                            </div>
                        </>
                    )}

                    {/* Edit Mode */}
                    {!isStreaming && mode === "edit" && attachedEvent && (
                        <div className="mt-3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <button
                                        onClick={handleBackToPreview}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <FontAwesomeIcon
                                            icon={faRobot}
                                            className="text-gray-600 dark:text-gray-400"
                                        />
                                    </button>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Modifier l'événement
                                    </h3>
                                </div>

                                <EventForm
                                    event={attachedEvent}
                                    onChange={() => {}}
                                    onSubmit={handleEventSubmitted}
                                    onCancel={handleBackToPreview}
                                />
                            </div>
                        </div>
                    )}

                    {/* Timestamp */}
                    <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString(
                            "fr-FR",
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                            },
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIMessageCard;
