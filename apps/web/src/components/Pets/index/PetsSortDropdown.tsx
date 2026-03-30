import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowsDownUp, Check } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import Toggle from "../../Form/Toggle";

export type SortKey = "order" | "name_asc" | "name_desc" | "youngest" | "oldest";

interface PetsSortDropdownProps {
    sortKey: SortKey;
    onSortChange: (key: SortKey) => void;
    showInactive: boolean;
    onShowInactiveChange: (value: boolean) => void;
}

const SORT_OPTIONS: { key: SortKey; labelKey: string }[] = [
    { key: "order", labelKey: "pets.sort_order" },
    { key: "name_asc", labelKey: "pets.sort_name_asc" },
    { key: "name_desc", labelKey: "pets.sort_name_desc" },
    { key: "youngest", labelKey: "pets.sort_youngest" },
    { key: "oldest", labelKey: "pets.sort_oldest" },
];

export default function PetsSortDropdown({
    sortKey,
    onSortChange,
    showInactive,
    onShowInactiveChange,
}: PetsSortDropdownProps) {
    const { t } = useTranslation();
    const isNonDefault = sortKey !== "order";
    const currentLabel = SORT_OPTIONS.find((o) => o.key === sortKey);

    return (
        <Menu as="div" className="relative">
            <MenuButton
                className={`flex items-center gap-1.5 h-10 px-3 rounded-full transition-colors ${
                    isNonDefault
                        ? "bg-primary-100 text-primary-600"
                        : "text-lin-7 hover:bg-lin-2"
                }`}
            >
                <ArrowsDownUp size={18} weight={isNonDefault ? "bold" : "regular"} />
                {isNonDefault && currentLabel && (
                    <span className="text-xs font-semibold hidden sm:inline">
                        {t(currentLabel.labelKey)}
                    </span>
                )}
            </MenuButton>

            <MenuItems
                transition
                className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-[16px] bg-lin-0 shadow-ds-sm ring-1 ring-lin-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                {/* Section tri */}
                <div className="p-1">
                    <p className="px-3 py-1.5 text-[11px] font-semibold text-lin-7 uppercase tracking-wider">
                        {t("pets.sort_label")}
                    </p>
                    {SORT_OPTIONS.map((opt) => (
                        <MenuItem key={opt.key}>
                            <button
                                type="button"
                                className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 text-sm text-dark rounded-lg data-[focus]:bg-primary-50 transition-colors"
                                onClick={() => onSortChange(opt.key)}
                            >
                                {sortKey === opt.key ? (
                                    <Check size={16} className="text-primary-500 flex-shrink-0" />
                                ) : (
                                    <span className="w-4 flex-shrink-0" />
                                )}
                                {t(opt.labelKey)}
                            </button>
                        </MenuItem>
                    ))}
                </div>

                {/* Section toggle inactifs */}
                <div className="border-t border-lin-3 p-1">
                    <div className="px-3 py-2 min-h-[44px] flex items-center">
                        <Toggle
                            label={t("pets.show_inactive")}
                            initialState={showInactive}
                            onChange={onShowInactiveChange}
                        />
                    </div>
                </div>
            </MenuItems>
        </Menu>
    );
}
