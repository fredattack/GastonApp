import { useMemo } from "react";

import { usePets } from "../../../contexts/PetsContext";
import { getEventTypeLabel } from "../../../utils/aiTransformers";

interface PreviewAiResponseProps {
    aiResponse: AIResponse;
}

const formatDate = (dateString: string | Date): string => {
    try {
        return new Date(dateString).toLocaleString("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
        });
    } catch {
        return "Date invalide";
    }
};

const PreviewAiResponse = ({
    aiResponse,
}: PreviewAiResponseProps): JSX.Element => {
    const { pets } = usePets();

    // Type guard: Only render if data is AIEventData (has title and petId)
    if (!('title' in aiResponse.data && 'petId' in aiResponse.data)) {
        return <div>Type de données non supporté pour l'aperçu</div>;
    }

    const eventData = aiResponse.data as AIEventData;

    const selectedPets = useMemo(() => {
        if (!eventData.petId || eventData.petId.length === 0) {
            return [];
        }

        return eventData.petId
            .map((petId) => pets.find((pet) => pet.id === petId.toString()))
            .filter((pet): pet is Pet => pet !== undefined);
    }, [eventData.petId, pets]);

    const petNames = useMemo(() => {
        if (selectedPets.length === 0) {
            return "Aucun animal sélectionné";
        }

        return selectedPets.map((pet) => pet.name).join(", ");
    }, [selectedPets]);

    const recurrenceDetails = useMemo(() => {
        if (!eventData.recurrence) {
            return [];
        }

        const details = [];

        if (eventData.recurrence.frequency_type) {
            const typeLabels: Record<string, string> = {
                daily: "Quotidienne",
                weekly: "Hebdomadaire",
                monthly: "Mensuelle",
            };
            details.push(
                `Type : ${typeLabels[eventData.recurrence.frequency_type] || eventData.recurrence.frequency_type}`,
            );
        }

        if (eventData.recurrence.frequency) {
            details.push(
                `Fréquence : ${eventData.recurrence.frequency} jour(s)`,
            );
        }

        if (eventData.recurrence.end_date) {
            details.push(
                `Date de fin : ${formatDate(eventData.recurrence.end_date)}`,
            );
        }

        if (eventData.recurrence.days && eventData.recurrence.days.length > 0) {
            details.push(`Jours : ${eventData.recurrence.days.join(", ")}`);
        }

        return details;
    }, [eventData.recurrence]);

    const generalDetails = useMemo(() => {
        const details = [];

        details.push(`Type : ${getEventTypeLabel(eventData.type)}`);
        details.push(`Animal(aux) : ${petNames}`);

        if (eventData.start_date) {
            details.push(`Début : ${formatDate(eventData.start_date)}`);
        }

        if (eventData.end_date) {
            details.push(`Fin : ${formatDate(eventData.end_date)}`);
        }

        details.push(`Récurrence : ${eventData.is_recurring ? "Oui" : "Non"}`);
        details.push(
            `Toute la journée : ${eventData.is_full_day ? "Oui" : "Non"}`,
        );

        return details.filter(Boolean);
    }, [eventData, petNames]);

    return (
        <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
            >
                <div
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                    className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                />
            </div>

            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-base font-semibold text-indigo-600">
                    Aperçu de l&apos;Événement
                </h2>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {eventData.title}
                </p>
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-600 sm:text-xl">
                {eventData.notes || "Aucune note"}
            </p>

            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-2">
                {/* Détails généraux */}
                <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:p-10">
                    <h3 className="text-indigo-600 text-base font-semibold">
                        Détails de l&apos;Événement
                    </h3>
                    <ul className="mt-8 space-y-3 text-gray-600 text-sm">
                        {generalDetails.map((detail) => (
                            <li key={detail} className="flex gap-x-3">
                                {detail}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Détails de la récurrence */}
                {eventData.is_recurring && recurrenceDetails.length > 0 && (
                    <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:p-10">
                        <h3 className="text-indigo-600 text-base font-semibold">
                            Récurrence
                        </h3>
                        <ul className="mt-8 space-y-3 text-gray-600 text-sm">
                            {recurrenceDetails.map((detail) => (
                                <li key={detail} className="flex gap-x-3">
                                    {detail}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviewAiResponse;
