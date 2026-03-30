import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Funnel } from "@phosphor-icons/react";
import Toggle from "../../Form/Toggle";
import MultiSelect from "../../Form/MultiSelect";

interface EventDropdownProps {
    filters: object;
    onFiltersChange: (filters: object) => void;
}

const EventCalendarDropdown = ({
    filters,
    onFiltersChange,
}: EventDropdownProps) => {
    const handleChange = (key: string, value: any) => {
        if (value !== undefined) {
            onFiltersChange({
                ...filters,
                [key]: value,
            });
        }
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="flex items-center justify-center w-10 h-10 rounded-full text-[#6B6B6B] hover:bg-lin-2 transition-colors">
                <Funnel size={18} />
            </MenuButton>

            <MenuItems
                transition
                className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-[16px] bg-lin-0 shadow-ds-sm ring-1 ring-lin-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <div className="p-1">
                    <p className="px-3 py-1.5 text-[11px] font-semibold text-[#9A9A8A] uppercase tracking-wider">
                        Filtres
                    </p>
                    <div className="px-3 py-2 min-h-[44px] flex items-center">
                        <Toggle
                            label="Terminés"
                            initialState={
                                "is_done" in filters
                                    ? Boolean((filters as any).is_done)
                                    : false
                            }
                            onChange={(e) => handleChange("is_done", e)}
                        />
                    </div>
                </div>
                <div className="border-t border-lin-3 p-1">
                    <p className="px-3 py-1.5 text-[11px] font-semibold text-[#9A9A8A] uppercase tracking-wider">
                        Espèces
                    </p>
                    <div className="px-3 py-2">
                        <MultiSelect
                            options={[
                                { label: "Chat", value: "cat" },
                                { label: "Chien", value: "dog" },
                            ]}
                            value={(filters as any).pet_species ?? []}
                            onChange={(e) => handleChange("pet_species", e)}
                        />
                    </div>
                </div>
            </MenuItems>
        </Menu>
    );
};

export default EventCalendarDropdown;
