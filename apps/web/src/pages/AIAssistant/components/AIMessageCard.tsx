import React, { useState } from "react";
import { Robot } from "@phosphor-icons/react";
import { usePets } from "../../../contexts/PetsContext";
import { extractPrimaryData } from "../../../utils/aiTransformers";
import EventForm from "../../../components/Event/Form/EventForm";
import PetForm from "../../../components/Pets/form/PetForm";
import IntentHeader from "./IntentHeader";
import EventHeroSection from "./EventHeroSection";
import PetHeroSection from "./PetHeroSection";
import ContextualActions from "./ContextualActions";
import SecondaryDetails from "./SecondaryDetails";
import { modelService } from "../../../services";
import { useToast } from "../../../providers/ToastProvider";
import HealthDisclaimer from "../../../components/AI/HealthDisclaimer";
import QueryResults from "../../../components/AI/QueryResults";
import AdviceCard from "../../../components/AI/AdviceCard";
import MetricsChart from "../../../components/AI/MetricsChart";
import DeletePreview from "../../../components/AI/DeletePreview";

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
    const { pets, refreshPets } = usePets();
    const { addToast } = useToast();
    const { attachedEvent, attachedPet, isStreaming } = message.metadata || {};
    const [mode, setMode] = useState<"preview" | "edit">("preview");
    const [isCreating, setIsCreating] = useState(false);

    // Get requestType from AI response
    const requestType = aiResponse?.requestType || "createEvent";
    const isQuery = requestType === "query" || requestType === "petQuery" || requestType === "queryDiet" || requestType === "queryFeedingStatus";
    const isAdvice = requestType === "advice" || requestType === "logHealthEvent";
    const isMetrics = requestType === "createMetric";
    const isDelete =
        requestType === "deleteEvent" || requestType === "deletePet";
    const isEvent = requestType === "createEvent" || requestType === "updateEvent" || requestType === "logHealthEvent";
    const isPet = requestType === "createPet" || requestType === "updatePet";
    const isFeeding = requestType === "updateFeedingSchedule" || requestType === "markFeeding" || requestType === "batchMarkFeeding";
    const isClarification = requestType === "clarification";
    const isMultiAction = requestType === "multiAction";
    const hasAiResponse = !!aiResponse;

    // Render for any AI response — the card handles all types
    if (!hasAiResponse && !attachedEvent && !attachedPet) {
        return null;
    }

    const getPetInfo = () => {
        if (
            !attachedEvent ||
            !attachedEvent.pets ||
            attachedEvent.pets.length === 0
        ) {
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
            // Event creation failed
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
            case "findVet":
                // TODO: Open veterinary search modal (Phase 3)
                // TODO: implement vet finder
                addToast({
                    message:
                        "Recherche de vétérinaires - Fonctionnalité à venir",
                    type: "info",
                });
                break;
            case "callEmergency":
                // Open emergency numbers
                if (
                    window.confirm(
                        "Voulez-vous appeler les urgences vétérinaires ?",
                    )
                ) {
                    window.open("tel:112", "_self");
                }
                break;
            case "learnMore":
                // TODO: Open health info modal
                // TODO: implement health info
                addToast({
                    message:
                        "Plus d'informations santé - Fonctionnalité à venir",
                    type: "info",
                });
                break;
            case "dismiss":
                // Dismissed - could save to localStorage
                // Disclaimer dismissed
                break;
            default:
                break;
        }
    };

    const handleDelete = async () => {
        if (!aiResponse?.result) return;

        setIsCreating(true);
        try {
            const deleteData = aiResponse.result as unknown as DeleteData;
            const collection = requestType === "deletePet" ? "pets" : "events";
            const items = deleteData.itemsToDelete || [];

            for (const item of items) {
                await modelService.delete(
                    collection,
                    {
                        id: item.id,
                        start_date: item.date,
                    },
                    false,
                );
            }

            addToast({
                message: "Suppression effectuée avec succès !",
                type: "success",
            });

            if (requestType === "deletePet" && refreshPets) {
                await refreshPets();
            }

            if (onEventCreated) {
                onEventCreated();
            }
        } catch (error) {
            addToast({
                message: "Une erreur est survenue lors de la suppression.",
                type: "error",
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleCreatePet = async () => {
        if (!attachedPet) return;

        setIsCreating(true);
        try {
            if (!attachedPet.name || !attachedPet.species) {
                addToast({
                    message: "Les champs Nom et Espèce sont obligatoires !",
                    type: "error",
                });
                setIsCreating(false);
                return;
            }

            // Préparer les données du pet pour l'API
            const petData = {
                name: attachedPet.name,
                species: attachedPet.species,
                breed: attachedPet.breed || "",
                birthDate: attachedPet.birthDate || "",
                isActive: attachedPet.isActive !== false,
                order: attachedPet.order || 1,
                ownerId: attachedPet.ownerId || "",
                created_at: attachedPet.created_at || new Date().toISOString(),
            };

            await modelService.add("pets", petData);

            addToast({
                message: `${attachedPet.name} a été ajouté avec succès !`,
                type: "success",
            });

            // Rafraîchir la liste des pets
            if (refreshPets) {
                await refreshPets();
            }

            if (onEventCreated) {
                onEventCreated();
            }
        } catch (error) {
            // Pet creation failed
            addToast({
                message: "Une erreur est survenue lors de l'ajout de l'animal.",
                type: "error",
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleEditPet = () => {
        setMode("edit");
    };

    const handlePetSubmitted = () => {
        if (onEventCreated) {
            onEventCreated();
        }
        setMode("preview");
    };

    // Extract primary data for display
    const primaryData = attachedEvent
        ? extractPrimaryData(attachedEvent)
        : null;
    const petInfo = getPetInfo();

    // Detect missing pets (event created but no pet found)
    // Check backend warning first, fallback to local detection
    const petWarning = (aiResponse as Record<string, unknown> | undefined)
        ?.petWarning as
        | {
              title?: string;
              message?: string;
              suggestions?: string[];
              availablePets?: Array<{
                  id: string;
                  name: string;
                  species: string;
              }>;
          }
        | undefined;
    const hasMissingPets =
        petWarning ||
        (attachedEvent &&
            (!attachedEvent.pets || attachedEvent.pets.length === 0));

    const score = aiResponse?.confidenceScore;
    const description =
        message.content || aiResponse?.description || "Génération en cours...";

    return (
        <div className="flex gap-3 mb-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <Robot size={16} />
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
                    {!isStreaming &&
                        (isQuery || isAdvice || isMetrics || isDelete) &&
                        description && (
                            <p className="text-sm text-gray-900 dark:text-white leading-relaxed mb-3">
                                {description}
                            </p>
                        )}

                    {/* Query Results */}
                    {!isStreaming && isQuery && aiResponse?.result && (
                        <QueryResults
                            queryResult={aiResponse.result as unknown as QueryResult}
                        />
                    )}

                    {/* Advice Card */}
                    {!isStreaming && isAdvice && aiResponse?.result && (
                        <AdviceCard
                            adviceData={aiResponse.result as unknown as AdviceData}
                        />
                    )}

                    {/* Metrics Chart */}
                    {!isStreaming && isMetrics && aiResponse?.result && (
                        <MetricsChart
                            metricsHistory={aiResponse.result as unknown as MetricsHistory}
                        />
                    )}

                    {/* Delete Preview */}
                    {!isStreaming && isDelete && aiResponse?.result && (
                        <DeletePreview
                            deleteData={aiResponse.result as unknown as DeleteData}
                            requestType={
                                requestType as "deleteEvent" | "deletePet"
                            }
                            onDelete={handleDelete}
                            isLoading={isCreating}
                        />
                    )}

                    {/* Event Preview Mode */}
                    {!isStreaming &&
                        isEvent &&
                        attachedEvent &&
                        primaryData &&
                        mode === "preview" && (
                            <>
                                {/* Intent Header */}
                                <IntentHeader
                                    requestType={requestType}
                                    eventType={attachedEvent.type}
                                    description={description}
                                    score={score}
                                />

                                {/* Warning for missing pets */}
                                {hasMissingPets && (
                                    <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 text-amber-600 dark:text-amber-400 text-xl">
                                                ⚠️
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                                    {petWarning?.title ||
                                                        "Animal introuvable"}
                                                </h4>
                                                <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                                                    {petWarning?.message ||
                                                        "L'animal mentionné dans votre demande n'existe pas dans votre liste d'animaux."}
                                                </p>

                                                {/* Display suggestions from backend */}
                                                {petWarning?.suggestions &&
                                                    petWarning.suggestions
                                                        .length > 0 && (
                                                        <div className="text-xs text-amber-700 dark:text-amber-300 mb-2">
                                                            <strong>
                                                                💡 Suggestions :
                                                            </strong>
                                                            <ul className="list-disc list-inside ml-2 mt-1">
                                                                {petWarning.suggestions.map(
                                                                    (
                                                                        suggestion: string,
                                                                        idx: number,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            {
                                                                                suggestion
                                                                            }
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}

                                                {/* Fallback suggestion if no backend suggestions */}
                                                {!petWarning?.suggestions && (
                                                    <p className="text-xs text-amber-700 dark:text-amber-300">
                                                        💡{" "}
                                                        <strong>
                                                            Suggestion :
                                                        </strong>{" "}
                                                        Créez d'abord l'animal
                                                        avant de créer cet
                                                        événement, ou modifiez
                                                        l'événement pour
                                                        sélectionner un animal
                                                        existant.
                                                    </p>
                                                )}

                                                {/* Display available pets if provided by backend */}
                                                {petWarning?.availablePets &&
                                                    petWarning.availablePets
                                                        .length > 0 && (
                                                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800">
                                                            <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-2">
                                                                Vos animaux
                                                                disponibles :
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {petWarning.availablePets.map(
                                                                    (
                                                                        pet: any,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                pet.id
                                                                            }
                                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
                                                                        >
                                                                            {pet.species ===
                                                                            "cat"
                                                                                ? "🐱"
                                                                                : pet.species ===
                                                                                    "dog"
                                                                                  ? "🐶"
                                                                                  : "🐾"}{" "}
                                                                            {
                                                                                pet.name
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                )}

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

                    {/* Event Edit Mode */}
                    {!isStreaming && mode === "edit" && attachedEvent && (
                        <div className="mt-3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <button
                                        onClick={handleBackToPreview}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Robot
                                            size={20}
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
                                    submitable
                                />
                            </div>
                        </div>
                    )}

                    {/* Pet Preview Mode */}
                    {!isStreaming &&
                        isPet &&
                        attachedPet &&
                        mode === "preview" && (
                            <>
                                {/* Description */}
                                <p className="text-sm text-gray-900 dark:text-white leading-relaxed mb-3">
                                    {description}
                                </p>

                                {/* Pet Hero Section */}
                                <PetHeroSection petData={attachedPet} />

                                {/* Contextual Actions */}
                                <div className="mt-4">
                                    <ContextualActions
                                        requestType={requestType}
                                        onConfirm={handleCreatePet}
                                        onEdit={handleEditPet}
                                        isLoading={isCreating}
                                    />
                                </div>
                            </>
                        )}

                    {/* Pet Edit Mode */}
                    {!isStreaming && mode === "edit" && attachedPet && (
                        <div className="mt-3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <button
                                        onClick={handleBackToPreview}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Robot
                                            size={20}
                                            className="text-gray-600 dark:text-gray-400"
                                        />
                                    </button>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Modifier l'animal
                                    </h3>
                                </div>

                                <PetForm
                                    petFormData={attachedPet}
                                    onChange={() => {}}
                                    onSubmit={handlePetSubmitted}
                                    onCancel={handleBackToPreview}
                                    submitable
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
