import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Plus,
    PawPrint,
    MagnifyingGlass,
    PencilSimple,
    Prohibit,
    CheckCircle,
    Skull,
    Trash,
    FirstAid,
    BowlFood,
    CalendarPlus,
    Funnel,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

import { usePets } from "../../../contexts/PetsContext";
import PetsCard from "../../../components/Pets/index/PetsCard";
import PetsFilterBar, { type Species } from "../../../components/Pets/index/PetsFilterBar";
import { type SortKey } from "../../../components/Pets/index/PetsSortDropdown";
import { useToast } from "../../../providers/ToastProvider";
import { SkeletonList } from "../../../components/Skeleton";
import { modelService } from "../../../services";
import { logger } from "@/utils/logger";

type DeletionQueueItem = {
    id: string;
    timeout: NodeJS.Timeout | null;
    data: Pet | undefined;
};

function getAge(birthDate?: string): number {
    if (!birthDate) return -1;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return -1;
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age--;
    }
    return age >= 0 ? age : -1;
}

const Pets = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const { pets, isLoading, refreshPets } = usePets();
    const [deletionQueue, setDeletionQueue] = useState<DeletionQueueItem[]>([]);

    // Filter & sort state
    const [species, setSpecies] = useState<Species>("all");
    const [sortKey, setSortKey] = useState<SortKey>("order");
    const [showInactive, setShowInactive] = useState(true);

    const hasActiveFilters = species !== "all" || sortKey !== "order" || !showInactive;
    const clearFilters = () => {
        setSpecies("all");
        setSortKey("order");
        setShowInactive(true);
    };

    useEffect(() => {
        refreshPets();
    }, []);

    const filteredData = useMemo(() => {
        let result = pets ?? [];

        // Text search
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.breed?.toLowerCase().includes(q),
            );
        }

        // Species filter
        if (species === "dog") result = result.filter((p) => p.species === "dog");
        else if (species === "cat") result = result.filter((p) => p.species === "cat");
        else if (species === "other") result = result.filter((p) => !["dog", "cat"].includes(p.species));

        // Inactive filter
        if (!showInactive) result = result.filter((p) => p.isActive !== false);

        // Sort
        result = [...result].sort((a, b) => {
            switch (sortKey) {
                case "name_asc":
                    return a.name.localeCompare(b.name);
                case "name_desc":
                    return b.name.localeCompare(a.name);
                case "youngest":
                    return getAge(a.birthDate) - getAge(b.birthDate);
                case "oldest":
                    return getAge(b.birthDate) - getAge(a.birthDate);
                default:
                    return (a.order ?? 0) - (b.order ?? 0);
            }
        });

        return result;
    }, [pets, search, species, sortKey, showInactive]);

    const generateActions = (id: number | string) => {
        const pet = pets.find((pet) => pet.id == id);
        return [
            {
                label: t("pets.edit"),
                icon: <PencilSimple size={18} />,
                onClick: () => handleEdit(id),
            },
            {
                label: pet?.isActive ? t("pets.set_inactive") : t("pets.set_active"),
                icon: pet?.isActive ? <Prohibit size={18} /> : <CheckCircle size={18} />,
                onClick: () => toggleActiveStatus(id),
            },
            {
                label: t("pets.set_deceased"),
                icon: <Skull size={18} />,
                onClick: () => setDeceased(id),
            },
            {
                label: t("pets.delete"),
                icon: <Trash size={18} />,
                onClick: () => deleteAnimal(id),
            },
            {
                label: t("pets.add_treatment"),
                icon: <FirstAid size={18} />,
                onClick: () => addTreatment(id),
            },
            {
                label: t("pets.add_menu"),
                icon: <BowlFood size={18} />,
                onClick: () => addMenu(id),
            },
            {
                label: t("pets.add_rendezvous"),
                icon: <CalendarPlus size={18} />,
                onClick: () => addRendezvous(id),
            },
        ];
    };

    const handleCreate = () => {
        navigate("/content/pets/create");
    };

    const handleEdit = (id: number | string) => {
        navigate(`/content/pets/${id}`);
    };

    const toggleActiveStatus = (id: number | string) => {
        // TODO: implement
    };

    const setDeceased = (id: number | string) => {
        // TODO: implement
    };

    const deleteAnimal = async (id: number | string) => {
        const petToDelete = pets.find((pet) => pet.id === id);

        if (!petToDelete) {
            addToast({ message: t("pets.not_found"), type: "error" });
            return;
        }

        setDeletionQueue((prevQueue: any) => [
            ...prevQueue,
            { id: String(id), timeout: null, data: petToDelete },
        ]);

        const timeout = setTimeout(async () => {
            try {
                await modelService.delete("pets", petToDelete);
                logger.info(`Animal with ID: ${id} successfully deleted.`);
                addToast({ message: t("pets.deleted_success"), type: "success" });
                setDeletionQueue((prevQueue) =>
                    prevQueue.filter((item) => item.id !== String(id)),
                );
                refreshPets();
            } catch (error) {
                console.error(`Error deleting animal with ID: ${id}`, error);
                addToast({ message: t("pets.deleted_error"), type: "error" });
                setDeletionQueue((prevQueue) =>
                    prevQueue.filter((item) => item.id !== String(id)),
                );
            }
        }, 10000);

        setDeletionQueue((prevQueue) =>
            prevQueue.map((item) =>
                item.id === String(id) ? { ...item, timeout } : item,
            ),
        );
    };

    const undoDelete = (id: number | string) => {
        const item = deletionQueue.find((entry) => entry.id === id);
        if (item) {
            clearTimeout(item.timeout!);
            setDeletionQueue((prevQueue) =>
                prevQueue.filter((entry) => entry.id !== id),
            );
        }
    };

    const addTreatment = (id: number | string) => {
        // TODO: implement
    };

    const addMenu = (id: number | string) => {
        // TODO: implement
    };

    const addRendezvous = (id: number | string) => {
        // TODO: implement
    };

    const petCount = filteredData.length;
    const totalCount = pets?.length ?? 0;

    return (
        <div data-testid="pets-page" className="py-6 pb-32 md:pb-6">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <PawPrint size={24} weight="regular" className="text-primary-500" />
                        <h1 className="text-xl font-bold text-dark">
                            {t("pets.my_pets")}
                        </h1>
                        <span className="text-sm text-lin-7 font-medium">
                            {hasActiveFilters
                                ? t("pets.count_filtered", { count: petCount, total: totalCount })
                                : petCount > 1
                                    ? t("pets.count_plural", { count: petCount })
                                    : t("pets.count", { count: petCount })}
                        </span>
                    </div>

                    {/* Bouton desktop */}
                    <button
                        onClick={handleCreate}
                        data-testid="pets-create-button"
                        className="hidden md:inline-flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#1A1A1A] hover:shadow-ds-md transition-all duration-250 active:scale-[0.98]"
                    >
                        <Plus size={18} weight="bold" />
                        {t("pets.add")}
                    </button>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 px-4 py-3 bg-lin-1 border-2 border-transparent rounded-xl focus-within:border-primary-400 focus-within:shadow-[0_0_0_3px_rgba(143,169,152,0.1)] transition-all">
                    <MagnifyingGlass size={20} className="text-lin-7 flex-shrink-0" />
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-base text-dark placeholder:text-lin-7 font-nunito"
                        data-testid="pets-search-input"
                        placeholder={t("pets.search")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Bar */}
            <PetsFilterBar
                species={species}
                onSpeciesChange={setSpecies}
                sortKey={sortKey}
                onSortChange={setSortKey}
                showInactive={showInactive}
                onShowInactiveChange={setShowInactive}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
            />

            {/* Contenu */}
            {isLoading ? (
                <SkeletonList count={6} height="h-20" columns={3} />
            ) : filteredData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredData.map((pet: Pet) => {
                        const actions = generateActions(pet.id);
                        return (
                            <PetsCard
                                key={pet.id || Math.random()}
                                pet={pet}
                                actions={actions}
                                onEdit={() => handleEdit(pet.id)}
                            />
                        );
                    })}
                </div>
            ) : totalCount > 0 ? (
                /* Empty state : filtres actifs mais aucun résultat */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-lin-2 flex items-center justify-center mb-4">
                        <Funnel size={40} weight="regular" className="text-lin-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark mb-1">
                        {t("pets.no_pets_filtered")}
                    </h3>
                    <p className="text-sm text-lin-7 mb-6">
                        {t("pets.no_pets_filtered_desc")}
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold text-sm transition-colors"
                        >
                            {t("pets.clear_filters")}
                        </button>
                    )}
                </div>
            ) : (
                /* Empty state : aucun animal */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-lin-2 flex items-center justify-center mb-4">
                        <PawPrint size={40} weight="regular" className="text-lin-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark mb-1">
                        {t("pets.no_pets")}
                    </h3>
                    <p className="text-sm text-lin-7 mb-6">
                        {t("pets.no_pets_description")}
                    </p>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#1A1A1A] transition-all"
                    >
                        <Plus size={18} weight="bold" />
                        {t("pets.add")}
                    </button>
                </div>
            )}

            {/* FAB mobile */}
            <button
                onClick={handleCreate}
                className="md:hidden fixed bottom-24 right-5 w-14 h-14 rounded-full bg-primary-400 text-white flex items-center justify-center shadow-ds-lg hover:bg-primary-500 hover:shadow-ds-xl active:scale-95 transition-all z-[1200]"
                aria-label={t("pets.add")}
            >
                <Plus size={24} weight="bold" />
            </button>
        </div>
    );
};

export default Pets;
