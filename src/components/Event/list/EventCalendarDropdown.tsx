import React from "react";
import {
    faEllipsisH,
    faEye,
    faEdit,
    faTrash,
    faCopy,
    faCheckSquare,
    faTimes,
    faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

    // const handleEdit = () => {
    //     handelOpenModal("event", "edit", event);
    // };

    const handleChange = (key: string, value: any) => {
        console.log("e", value);
        if (value) {
            onFiltersChange({
                ...filters,
                [key]: value,
            });
        }

        console.log(filters);
    };

    return (
        <div className="dropdown flex justify-center items-center col-span-2">
            <Dropdown
                placement="top-end"
                btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black dark:text-white-dark hover:text-primary dark:hover:text-primary"
                button={<FontAwesomeIcon icon={faFilter} className="m-auto" />}
            >
                <ul className="!min-w-[170px] z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2">
                    <li>
                        <button
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            // onClick={handleEdit}
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
                    <li className={"border-b"}></li>
                    <li className={"pb-2 px-2"}>
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
                    <li className={"border-b"}></li>
                    <li>
                        <button
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                        >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Delete Event
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
};

export default EventCalendarDropdown;
