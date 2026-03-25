import React, { useCallback, useState } from "react";
import { FeedingProvider, useFeeding } from "../../../contexts/FeedingContext";
import { useFeedingDashboard } from "../../../hooks/useFeedingDashboard";
import FeedingSlotTabs from "../../../components/Feeding/FeedingSlotTabs";
import FeedingSpeciesSection from "../../../components/Feeding/FeedingSpeciesSection";
import SmartFeedingSuggestion from "../../../components/Feeding/SmartFeedingSuggestion";
import PetDietCard from "../../../components/Feeding/PetDietCard";
import VoiceCommandButton from "../../../components/Feeding/VoiceCommandButton";
import VoiceCommandFeedback from "../../../components/Feeding/VoiceCommandFeedback";

interface SelectedPet {
    petId: number;
    petName: string;
    petSpecies: string;
}

const FeedingDashboardContent: React.FC = () => {
    const {
        isLoading,
        activeSlot,
        setActiveSlot,
        speciesGroups,
        slotCounts,
        totalItems,
        totalDone,
        allDone,
        date,
        markAsDone,
        undoMark,
        markBatchDone,
        markSpeciesDone,
    } = useFeedingDashboard();

    const { refreshFeedings } = useFeeding();

    const [selectedPet, setSelectedPet] = useState<SelectedPet | null>(null);
    const [voiceResult, setVoiceResult] = useState<VoiceCommandResult | null>(
        null,
    );

    const handleToggle = useCallback(
        async (scheduleId: number, isDone: boolean) => {
            if (isDone) {
                await undoMark(scheduleId);
            } else {
                await markAsDone(scheduleId);
            }
        },
        [markAsDone, undoMark],
    );

    const handlePetTap = useCallback(
        (petId: number, petName: string, petSpecies: string) => {
            setSelectedPet({ petId, petName, petSpecies });
        },
        [],
    );

    const handleMarkAll = useCallback(() => {
        const allPendingIds = speciesGroups.flatMap((g) => g.pendingIds);
        if (allPendingIds.length > 0) {
            markBatchDone(allPendingIds);
        }
    }, [speciesGroups, markBatchDone]);

    const handleVoiceCommandResult = useCallback(
        async (result: VoiceCommandResult) => {
            setVoiceResult(result);

            if (result.status === "executed") {
                await refreshFeedings();
            }
        },
        [refreshFeedings],
    );

    const handleDismissFeedback = useCallback(() => {
        setVoiceResult(null);
    }, []);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "";
        const d = new Date(`${dateStr}T00:00:00`);
        return d.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
        });
    };

    const now = new Date();
    const timeStr = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div
                    className="h-8 rounded w-2/3"
                    style={{ backgroundColor: "#E8E5DC", borderRadius: "20px" }}
                />
                <div
                    className="h-12 rounded-xl"
                    style={{ backgroundColor: "#E8E5DC", borderRadius: "20px" }}
                />
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-16 rounded-xl"
                        style={{
                            backgroundColor: "#E8E5DC",
                            borderRadius: "20px",
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24" data-testid="feeding-dashboard">
            {/* Voice feedback banner — sits at the very top, above everything */}
            <div className="relative">
                <VoiceCommandFeedback
                    result={voiceResult}
                    onDismiss={handleDismissFeedback}
                />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="feeding-title">
                        Repas du jour
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(date)} · {timeStr}
                    </p>
                </div>

                <div className="flex-shrink-0 mt-1">
                    <VoiceCommandButton
                        onCommandResult={handleVoiceCommandResult}
                    />
                </div>
            </div>

            {/* Smart suggestion */}
            {!allDone && totalItems > 0 && (
                <SmartFeedingSuggestion
                    activeSlot={activeSlot}
                    totalItems={totalItems}
                    totalDone={totalDone}
                    speciesGroups={speciesGroups}
                    onAccept={handleMarkAll}
                    onAcceptSpecies={markSpeciesDone}
                />
            )}

            {/* Global progress */}
            {totalItems > 0 && (
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                allDone ? "bg-green-500" : "bg-primary"
                            }`}
                            style={{
                                width: `${(totalDone / totalItems) * 100}%`,
                            }}
                        />
                    </div>
                    <span
                        className={`text-sm font-bold ${
                            allDone
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-600 dark:text-gray-400"
                        }`}
                    >
                        {totalDone}/{totalItems}
                    </span>
                </div>
            )}

            {/* Slot tabs */}
            <FeedingSlotTabs
                activeSlot={activeSlot}
                onSlotChange={setActiveSlot}
                slotCounts={slotCounts}
            />

            {/* All done banner */}
            {allDone && totalItems > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                    <p className="text-green-700 dark:text-green-400 font-semibold text-lg">
                        Tous les repas sont faits !
                    </p>
                </div>
            )}

            {/* Empty state */}
            {speciesGroups.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-lg font-medium">
                        Aucun repas configure pour ce creneau
                    </p>
                    <p className="text-sm mt-1">
                        Ajoutez des regimes alimentaires pour vos animaux
                    </p>
                </div>
            )}

            {/* Species sections */}
            <div className="space-y-6">
                {speciesGroups.map((group) => (
                    <FeedingSpeciesSection
                        key={group.species}
                        group={group}
                        onToggle={handleToggle}
                        onBatchDone={markSpeciesDone}
                        onPetTap={handlePetTap}
                    />
                ))}
            </div>

            {/* Pet diet card modal */}
            {selectedPet && (
                <PetDietCard
                    petId={selectedPet.petId}
                    petName={selectedPet.petName}
                    petSpecies={selectedPet.petSpecies}
                    onClose={() => setSelectedPet(null)}
                />
            )}
        </div>
    );
};

const FeedingDashboardPage: React.FC = () => {
    return (
        <FeedingProvider>
            <FeedingDashboardContent />
        </FeedingProvider>
    );
};

export default FeedingDashboardPage;
