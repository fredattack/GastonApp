import Swal from "sweetalert2";
import { eventService, modelService } from "../../services";

export const showConfirmUpdateEventAlert = async (
    event: EventFormData,
    onSuccess: () => void,
) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            cancelButton: "btn btn-dark ltr:mr-3 rtl:ml-3 btn-sm",
            confirmButton: "btn btn-outline-danger btn-sm",
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
            showDenyButton: event.is_recurring, // Show deny button only if recurring

            confirmButtonText: event.is_recurring
                ? "Update all"
                : "Update this",
            denyButtonText: "Update this",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            padding: "2em",
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                console.log("event.start_date", event.start_date);
                try {
                    await eventService.update(event, true, event.start_date);

                    swalWithBootstrapButtons.fire(
                        "Updated!",
                        "The event has been updated.",
                        "success",
                    );
                    if (onSuccess) onSuccess();
                } catch (error) {
                    swalWithBootstrapButtons.fire(
                        "Error",
                        "Failed to update item.",
                        "error",
                    );
                    console.error("Error updating item:", error);
                }
            } else if (result.isDenied) {
                await eventService.update(event, false, event.start_date);

                swalWithBootstrapButtons.fire(
                    "All Updated!",
                    "All events have been updated.",
                    "success",
                );
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
