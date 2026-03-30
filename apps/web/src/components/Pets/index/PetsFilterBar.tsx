import { useTranslation } from "react-i18next";
import { Dog, Cat, PawPrint, X, type Icon } from "@phosphor-icons/react";
import PetsSortDropdown, { type SortKey } from "./PetsSortDropdown";

export type Species = "all" | "dog" | "cat" | "other";

interface PetsFilterBarProps {
    species: Species;
    onSpeciesChange: (s: Species) => void;
    sortKey: SortKey;
    onSortChange: (s: SortKey) => void;
    showInactive: boolean;
    onShowInactiveChange: (v: boolean) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

const SPECIES_OPTIONS: { key: Species; labelKey: string; icon: Icon }[] = [
    { key: "all", labelKey: "pets.filter_all", icon: PawPrint },
    { key: "dog", labelKey: "pets.species_dog", icon: Dog },
    { key: "cat", labelKey: "pets.species_cat", icon: Cat },
    { key: "other", labelKey: "pets.filter_other", icon: PawPrint },
];

export default function PetsFilterBar({
    species,
    onSpeciesChange,
    sortKey,
    onSortChange,
    showInactive,
    onShowInactiveChange,
    hasActiveFilters,
    onClearFilters,
}: PetsFilterBarProps) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between gap-2 mb-4">
            {/* Gauche : segmented control + reset */}
            <div className="flex items-center gap-2 min-w-0">
                <div className="flex bg-lin-2 rounded-full p-1 flex-shrink-0">
                    {SPECIES_OPTIONS.map(({ key, labelKey, icon: SpeciesIcon }) => {
                        const isActive = species === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onSpeciesChange(key)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all min-w-[44px] justify-center ${
                                    isActive
                                        ? "bg-lin-0 shadow-ds-sm text-dark"
                                        : "text-lin-7 hover:text-dark"
                                }`}
                            >
                                <SpeciesIcon
                                    size={18}
                                    weight={isActive ? "bold" : "regular"}
                                    className="flex-shrink-0"
                                />
                                <span className="hidden sm:inline">{t(labelKey)}</span>
                            </button>
                        );
                    })}
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-100 text-primary-600 text-xs font-semibold hover:bg-primary-200 transition-colors flex-shrink-0"
                    >
                        <X size={12} weight="bold" />
                        <span className="hidden sm:inline">{t("pets.clear_filters")}</span>
                    </button>
                )}
            </div>

            {/* Droite : sort dropdown */}
            <PetsSortDropdown
                sortKey={sortKey}
                onSortChange={onSortChange}
                showInactive={showInactive}
                onShowInactiveChange={onShowInactiveChange}
            />
        </div>
    );
}
