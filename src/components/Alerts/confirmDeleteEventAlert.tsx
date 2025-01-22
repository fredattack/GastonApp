import React from "react";
import Swal from "sweetalert2";
import { modelService } from "../../services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface ConfirmationAlertProps {
    event: any;
    onSuccess?: () => void;
}

const ConfirmDeleteEventAlert: React.FC<ConfirmationAlertProps> = ({
    event,
    onSuccess,
}) => {
    console.log("event.recurrence", event);
    const showAlert = async () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                cancelButton: "btn btn-dark ltr:mr-3 rtl:ml-3 btn-sm",
                confirmButton: "btn  btn-outline-danger btn-sm",
                denyButton: "btn btn-danger ltr:mr-3 rtl:ml-3 btn-sm",
                popup: "sweet-alerts",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                showDenyButton: event.is_recurring, // Condition pour afficher le bouton

                confirmButtonText: event.is_recurring
                    ? "Confirm all"
                    : "Confirm this",
                denyButtonText: "Confirm this",
                cancelButtonText: "Cancel",
                reverseButtons: true,
                padding: "2em",
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await modelService.delete("events", event, true);
                        swalWithBootstrapButtons.fire(
                            "Deleted!",
                            "The event has been deleted.",
                            "success",
                        );
                        console.log("onsuccess");
                        if (onSuccess) onSuccess(); // Callback après suppression réussie
                    } catch (error) {
                        swalWithBootstrapButtons.fire(
                            "Error",
                            "Failed to delete item.",
                            "error",
                        );
                        console.error("Error deleting item:", error);
                    }
                } else if (result.isDenied) {
                    await modelService.delete("events", event);

                    swalWithBootstrapButtons.fire(
                        "All Deleted!",
                        "All events have been deleted.",
                        "success",
                    );
                    console.log("onsuccess");
                    if (onSuccess) onSuccess();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "No changes were made.",
                        "error",
                    );
                }
            });
    };

    return (
        <button
            type="button"
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
            onClick={showAlert}
        >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Delete Event
        </button>
    );
};

export default ConfirmDeleteEventAlert;
