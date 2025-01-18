import React from "react";
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
import { useToast } from "../../../providers/ToastProvider";

interface EventDropdownProps {
    event: Event;
    onEdit?: () => void;
    onDelete?: () => void;
    onViewDetails?: () => void;
}

const EventDropdown = ({
    event,
    onEdit,
    onDelete,
    onViewDetails,
}: EventDropdownProps) => {
    const { addToast } = useToast();
    if (!onEdit && !onDelete && !onViewDetails) {
        return <></>;
    }
    const { handelOpenModal } = useMessage();

    const handleEdit = () => {
        handelOpenModal("event", "edit", event);
    };

    const handleChangeDoneStatus = () => {
        try {
            console.log("event", event);
            const resp = eventService.changeDoneStatus(event);
            console.log("resp", resp);
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
                        <button
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                            onClick={onDelete}
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

export default EventDropdown;
