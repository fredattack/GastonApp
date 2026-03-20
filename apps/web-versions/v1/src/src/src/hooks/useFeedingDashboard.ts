import { useMemo } from "react";
import { useFeeding } from "../contexts/FeedingContext";

interface SpeciesGroup {
    species: string;
    label: string;
    items: FeedingItem[];
    total: number;
    done: number;
    pendingIds: number[];
}

interface DashboardData {
    currentSlotData: FeedingSlotData | null;
    speciesGroups: SpeciesGroup[];
    totalItems: number;
    totalDone: number;
    allDone: boolean;
    slotCounts: Record<MealSlot, { total: number; done: number }>;
}

const SPECIES_LABELS: Record<string, string> = {
    dog: "Chiens",
    cat: "Chats",
};

export function useFeedingDashboard(): DashboardData & {
    activeSlot: MealSlot;
    setActiveSlot: (slot: MealSlot) => void;
    isLoading: boolean;
    markAsDone: (scheduleId: number) => Promise<void>;
    undoMark: (scheduleId: number) => Promise<void>;
    markBatchDone: (scheduleIds: number[]) => Promise<void>;
    markSpeciesDone: (species: string) => Promise<void>;
    refreshFeedings: () => Promise<void>;
    date: string | null;
} {
    const {
        todayData,
        isLoading,
        activeSlot,
        setActiveSlot,
        markAsDone,
        undoMark,
        markBatchDone,
        markSpeciesDone,
        refreshFeedings,
    } = useFeeding();

    const dashboardData = useMemo<DashboardData>(() => {
        if (!todayData) {
            return {
                currentSlotData: null,
                speciesGroups: [],
                totalItems: 0,
                totalDone: 0,
                allDone: false,
                slotCounts: {
                    morning: { total: 0, done: 0 },
                    noon: { total: 0, done: 0 },
                    evening: { total: 0, done: 0 },
                },
            };
        }

        const currentSlotData = todayData.slots[activeSlot];

        const bySpecies = new Map<string, FeedingItem[]>();
        for (const item of currentSlotData.items) {
            const existing = bySpecies.get(item.pet_species) || [];
            existing.push(item);
            bySpecies.set(item.pet_species, existing);
        }

        const speciesGroups: SpeciesGroup[] = [];
        for (const [species, items] of bySpecies) {
            const done = items.filter((i) => i.is_done).length;
            speciesGroups.push({
                species,
                label: SPECIES_LABELS[species] || species,
                items,
                total: items.length,
                done,
                pendingIds: items.filter((i) => !i.is_done).map((i) => i.schedule_id),
            });
        }

        // Dogs first, then cats, then others
        speciesGroups.sort((a, b) => {
            if (a.species === "dog") return -1;
            if (b.species === "dog") return 1;
            return 0;
        });

        const slotCounts: Record<MealSlot, { total: number; done: number }> = {
            morning: { total: todayData.slots.morning.total, done: todayData.slots.morning.done },
            noon: { total: todayData.slots.noon.total, done: todayData.slots.noon.done },
            evening: { total: todayData.slots.evening.total, done: todayData.slots.evening.done },
        };

        return {
            currentSlotData,
            speciesGroups,
            totalItems: currentSlotData.total,
            totalDone: currentSlotData.done,
            allDone: currentSlotData.total > 0 && currentSlotData.done === currentSlotData.total,
            slotCounts,
        };
    }, [todayData, activeSlot]);

    return {
        ...dashboardData,
        activeSlot,
        setActiveSlot,
        isLoading,
        markAsDone,
        undoMark,
        markBatchDone,
        markSpeciesDone,
        refreshFeedings,
        date: todayData?.date || null,
    };
}