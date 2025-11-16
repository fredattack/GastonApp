import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
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
    const isQuery = requestType === 'query';
    const isAdvice = requestType === 'advice';
    const isMetrics = requestType === 'metrics';
    const isDelete = requestType === 'deleteEvent' || requestType === 'deletePet';
    const isEvent = requestType?.includes('Event');
    const isPet = requestType?.includes('Pet');

    // Debug logs
    console.log('[AIMessageCard] Debug:', {
        requestType,
        isPet,
        isEvent,
        attachedPet,
        attachedEvent,
        aiResponse,
        messageMetadata: message.metadata,
    });

    // For query, advice, metrics, and delete, we don't need attachedEvent or attachedPet
    // For events we need attachedEvent, for pets we need attachedPet
    if (!attachedEvent && !attachedPet && !isQuery && !isAdvice && !isMetrics && !isDelete) {
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

    const handleDelete = async () => {
        if (!aiResponse?.data) return;

        setIsCreating(true);
        try {
            const deleteData = aiResponse.data as DeleteData;

            // TODO: Call backend API to perform delete operation
            // This will be implemented when backend support is added
            console.log('Delete operation:', deleteData);

            addToast({
                message: 'Suppression effectuée avec succès !',
                type: 'success',
            });

            if (onEventCreated) {
                onEventCreated();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            addToast({
                message: 'Une erreur est survenue lors de la suppression.',
                type: 'error',
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
            console.error("Erreur lors de la création de l'animal :", error);
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
    const primaryData = attachedEvent ? extractPrimaryData(attachedEvent) : null;
    const petInfo = getPetInfo();

    // Detect missing pets (event created but no pet found)
    const hasMissingPets = attachedEvent && (!attachedEvent.pets || attachedEvent.pets.length === 0);

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
                    {!isStreaming && (isQuery || isAdvice || isMetrics || isDelete) && description && (
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

                    {/* Metrics Chart */}
                    {!isStreaming && isMetrics && aiResponse?.data && (
                        <MetricsChart metricsHistory={aiResponse.data as MetricsHistory} />
                    )}

                    {/* Delete Preview */}
                    {!isStreaming && isDelete && aiResponse?.data && (
                        <DeletePreview
                            deleteData={aiResponse.data as DeleteData}
                            requestType={requestType as 'deleteEvent' | 'deletePet'}
                            onDelete={handleDelete}
                            isLoading={isCreating}
                        />
                    )}

                    {/* Event Preview Mode */}
                    {!isStreaming && isEvent && attachedEvent && primaryData && mode === "preview" && (
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
                                                Animal introuvable
                                            </h4>
                                            <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                                                L'animal mentionné dans votre demande n'existe pas dans votre liste d'animaux.
                                            </p>
                                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                                💡 <strong>Suggestion :</strong> Créez d'abord l'animal avant de créer cet événement, ou modifiez l'événement pour sélectionner un animal existant.
                                            </p>
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

                    {/* Pet Preview Mode */}
                    {!isStreaming && isPet && attachedPet && mode === "preview" && (
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
                                        <FontAwesomeIcon
                                            icon={faRobot}
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
                                    submitable={true}
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
