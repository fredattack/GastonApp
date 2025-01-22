import React from "react";
import { useToast } from "../../../providers/ToastProvider";

import {
    faEllipsisH,
    faEye,
    faEdit,
    faTrash,
    faCopy,
    faCheckSquare,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMessage } from "../../../contexts/MessageContext";
import Dropdown from "../../Dropdown";
import { eventService } from "../../../services";
import ConfirmDeleteEventAlert from "../../Alerts/confirmDeleteEventAlert";

interface EventDropdownProps {
    event: Event;
    onEdit?: () => void;
    onChange?: () => void;
    onViewDetails?: () => void;
}

const EventDropdown = ({
    event,
    onEdit,
    onChange,
    onViewDetails,
}: EventDropdownProps) => {
    if (!onEdit && !onChange && !onViewDetails) {
        return <></>;
    }
    const { handelOpenModal } = useMessage();
    const { addToast } = useToast();
    const handleEdit = () => {
        handelOpenModal("event", "edit", event);
    };

    const handleChangeDoneStatus = () => {
        try {
            eventService.changeDoneStatus(event);

            if (onChange) {
                onChange();
            }
            addToast({
                message: "Event successfully updated!",
                type: "success",
            });
        } catch (error) {
            addToast({
                message: "Error updating event!",
                type: "error",
            });
        }
    };

    const handleSuccess = () => {
        if (onChange) {
            onChange();
        }
    };

    const donestyle = event.is_done ? "text-red-600" : "text-green-600";
    return (
        <div className="dropdown flex justify-center items-center col-span-2">
            <Dropdown
                placement="top-end"
                btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black dark:text-white-dark hover:text-primary dark:hover:text-primary"
                button={
                    <FontAwesomeIcon icon={faEllipsisH} className="m-auto" />
                }
            >
                <ul className="!min-w-[170px] z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2">
                    <li>
                        <button
                            type="button"
                            className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${donestyle}`}
                            onClick={handleChangeDoneStatus}
                        >
                            <FontAwesomeIcon
                                icon={event.is_done ? faTimes : faCheckSquare}
                                className="mr-2"
                            />
                            {event.is_done ? "Mark as Undone" : "Mark as Done"}
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={handleEdit}
                        >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                            Edit Event
                        </button>
                    </li>
                    <li>
                        <ConfirmDeleteEventAlert
                            event={event}
                            onSuccess={() => handleSuccess()}
                        />
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
};

export default EventDropdown;
