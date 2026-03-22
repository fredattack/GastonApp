import React from "react";
import {
    DotsThree,
    Eye,
    PencilSimple,
    Trash,
    Copy,
    CheckSquare,
    X,
    Funnel,
} from "@phosphor-icons/react";
import { useMessage } from "../../../contexts/MessageContext";
import Toggle from "../../Form/Toggle";

import Dropdown from "../../Dropdown";
import { eventService } from "../../../services";
import { useToast } from "../../../providers/ToastProvider";
import MultiSelect from "../../Form/MultiSelect";

interface EventDropdownProps {
    filters: object;
    onFiltersChange: (filters: object) => void;
}

const EventCalendarDropdown = ({
    filters,
    onFiltersChange,
}: EventDropdownProps) => {
    const { addToast } = useToast();
    const { handelOpenModal } = useMessage();

    const handleChange = (key: string, value: any) => {
        if (value) {
            onFiltersChange({
                ...filters,
                [key]: value,
            });
        }
    };

    return (
        <div className="dropdown flex justify-center items-center col-span-2">
            <Dropdown
                placement="top-end"
                btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black dark:text-white-dark hover:text-primary dark:hover:text-primary"
                button={<Funnel size={20} className="m-auto" />}
            >
                <ul className="!min-w-[170px] z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2">
                    <li>
                        <button
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Toggle
                                label="Show done"
                                initialState={
                                    "is_done" in filters
                                        ? Boolean(filters.is_done)
                                        : undefined
                                }
                                onChange={(e) => handleChange("is_done", e)}
                            />
                        </button>
                    </li>
                    <li className="border-b" />
                    <li className="pb-2 px-2">
                        <MultiSelect
                            options={[
                                {
                                    label: "Cat",
                                    value: "cat",
                                },
                                {
                                    label: "Dog",
                                    value: "dog",
                                },
                            ]}
                            // @ts-ignore
                            value={filters.pet_species ?? []}
                            onChange={(e) => handleChange("pet_species", e)}
                        />
                    </li>
                    <li className="border-b" />
                    <li>
                        <button
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                        >
                            <Trash size={16} className="mr-2 inline" />
                            Delete Event
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
};

export default EventCalendarDropdown;
