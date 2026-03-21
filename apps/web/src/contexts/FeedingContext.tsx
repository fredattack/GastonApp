import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { feedingService } from "../services/FeedingService";

interface FeedingContextType {
    todayData: FeedingTodayResponse | null;
    isLoading: boolean;
    activeSlot: MealSlot;
    setActiveSlot: (slot: MealSlot) => void;
    markAsDone: (scheduleId: number) => Promise<void>;
    undoMark: (scheduleId: number) => Promise<void>;
    markBatchDone: (scheduleIds: number[]) => Promise<void>;
    markSpeciesDone: (species: string) => Promise<void>;
    refreshFeedings: () => Promise<void>;
}

const FeedingContext = createContext<FeedingContextType | undefined>(undefined);

function getCurrentSlot(): MealSlot {
    const hour = new Date().getHours();
    if (hour < 11) return "morning";
    if (hour < 16) return "noon";
    return "evening";
}

export const FeedingProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [todayData, setTodayData] = useState<FeedingTodayResponse | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [activeSlot, setActiveSlot] = useState<MealSlot>(getCurrentSlot());
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchFeedings = useCallback(async () => {
        try {
            const data = await feedingService.getTodayFeedings();
            setTodayData(data);
        } catch (error) {
            console.error("Failed to fetch feedings:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const markAsDone = useCallback(
        async (scheduleId: number) => {
            setTodayData((prev) => {
                if (!prev) return prev;
                const updated = JSON.parse(
                    JSON.stringify(prev),
                ) as FeedingTodayResponse;
                for (const slot of Object.values(updated.slots)) {
                    const item = slot.items.find(
                        (i) => i.schedule_id === scheduleId,
                    );
                    if (item) {
                        item.is_done = true;
                        item.fed_at = new Date().toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                        slot.done += 1;
                        break;
                    }
                }
                return updated;
            });

            try {
                await feedingService.markDone(scheduleId);
            } catch (error) {
                console.error("Failed to mark as done:", error);
                await fetchFeedings();
            }
        },
        [fetchFeedings],
    );

    const undoMark = useCallback(
        async (scheduleId: number) => {
            setTodayData((prev) => {
                if (!prev) return prev;
                const updated = JSON.parse(
                    JSON.stringify(prev),
                ) as FeedingTodayResponse;
                for (const slot of Object.values(updated.slots)) {
                    const item = slot.items.find(
                        (i) => i.schedule_id === scheduleId,
                    );
                    if (item && item.is_done) {
                        item.is_done = false;
                        item.fed_at = null;
                        item.fed_by = null;
                        item.log_id = null;
                        slot.done -= 1;
                        break;
                    }
                }
                return updated;
            });

            try {
                await feedingService.undoMark(scheduleId);
            } catch (error) {
                console.error("Failed to undo mark:", error);
                await fetchFeedings();
            }
        },
        [fetchFeedings],
    );

    const markBatchDone = useCallback(
        async (scheduleIds: number[]) => {
            setTodayData((prev) => {
                if (!prev) return prev;
                const updated = JSON.parse(
                    JSON.stringify(prev),
                ) as FeedingTodayResponse;
                for (const slot of Object.values(updated.slots)) {
                    for (const item of slot.items) {
                        if (
                            scheduleIds.includes(item.schedule_id) &&
                            !item.is_done
                        ) {
                            item.is_done = true;
                            item.fed_at = new Date().toLocaleTimeString(
                                "fr-FR",
                                { hour: "2-digit", minute: "2-digit" },
                            );
                            slot.done += 1;
                        }
                    }
                }
                return updated;
            });

            try {
                await feedingService.markBatch(scheduleIds);
            } catch (error) {
                console.error("Failed to mark batch:", error);
                await fetchFeedings();
            }
        },
        [fetchFeedings],
    );

    const markSpeciesDone = useCallback(
        async (species: string) => {
            setTodayData((prev) => {
                if (!prev) return prev;
                const updated = JSON.parse(
                    JSON.stringify(prev),
                ) as FeedingTodayResponse;
                const slotData = updated.slots[activeSlot];
                for (const item of slotData.items) {
                    if (item.pet_species === species && !item.is_done) {
                        item.is_done = true;
                        item.fed_at = new Date().toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                        slotData.done += 1;
                    }
                }
                return updated;
            });

            try {
                await feedingService.markBatchBySpecies(species, activeSlot);
            } catch (error) {
                console.error("Failed to mark species:", error);
                await fetchFeedings();
            }
        },
        [fetchFeedings, activeSlot],
    );

    useEffect(() => {
        fetchFeedings();
    }, [fetchFeedings]);

    // Poll every 30 seconds to stay in sync between users
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            feedingService
                .getTodayFeedings()
                .then((data) => {
                    setTodayData(data);
                })
                .catch(() => {});
        }, 30_000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <FeedingContext.Provider
            value={{
                todayData,
                isLoading,
                activeSlot,
                setActiveSlot,
                markAsDone,
                undoMark,
                markBatchDone,
                markSpeciesDone,
                refreshFeedings: fetchFeedings,
            }}
        >
            {children}
        </FeedingContext.Provider>
    );
};

export const useFeeding = (): FeedingContextType => {
    const context = useContext(FeedingContext);
    if (!context) {
        throw new Error("useFeeding must be used within a FeedingProvider");
    }
    return context;
};
