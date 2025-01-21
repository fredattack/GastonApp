import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";

import { modelService } from "../../../services";
import { useToast } from "../../../providers/ToastProvider";

import EventDetails from "./EventDetails";
import EventRecurrence from "./EventRecurrence";
import PetDetails from "./PetDetails";

const EventForm = forwardRef(
    ({ event, onSubmit, onChange, onCancel }: any, ref) => {
        const { addToast } = useToast();

        const [eventFormData, setEventFormData] = useState<EventFormData>({
            id: event?.id || null,
            petId: event?.petId || "",
            type: event?.type || "",
            start_date: event?.start_date || "",
            title: event?.title || "",
            end_date: event?.end_date || "",
            is_recurring: event?.is_recurring || false,
            is_full_day: event?.is_full_day || false,
            recurrence: event?.recurrence || {
                frequency_type: "",
                frequency: 1,
                days: [],
                end_date: "",
                occurrences: 0,
            },
            pets: event?.pets || [],
            notes: event?.notes || "",
            is_done: event?.is_done || false,
        });

        const [petOptions, setPetOptions] = useState<
            {
                value: string;
                label: string;
            }[]
        >([]);
        const [isLoadingPets, setIsLoadingPets] = useState<boolean>(true);

        useEffect(() => {
            const fetchPets = async () => {
                try {
                    const pets = await modelService.asOptions("pets");
                    setPetOptions(pets);
                } catch (error) {
                    console.error("Error fetching pets:", error);
                } finally {
                    setIsLoadingPets(false);
                }
            };
            fetchPets();
        }, []);

        useEffect(() => {
            if (!eventFormData.is_recurring) {
                setEventFormData((prev) => ({
                    ...prev,
                    recurrence: {
                        frequency_type: "",
                        frequency: 1,
                        days: [],
                        end_date: "",
                        occurrences: 0,
                    },
                }));
            }
        }, [eventFormData.is_recurring]);

        useImperativeHandle(ref, () => ({
            handleSubmit,
        }));

        const handleChange = (key: string, value: any) => {
            setEventFormData((prev) => ({
                ...prev,
                [key]: value,
            }));
            if (onChange) {
                onChange({
                    ...eventFormData,
                    [key]: value,
                });
            }
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                if (!eventFormData.type || !eventFormData.start_date) {
                    alert(
                        "Les champs Type et Date de début sont obligatoires !",
                    );
                    return;
                }
                if (eventFormData.id) {
                    await modelService.update(
                        "events",
                        eventFormData.id,
                        eventFormData,
                    );
                } else {
                    await modelService.add("events", eventFormData);
                }
                addToast({
                    message: "Event successfully created!",
                    type: "success",
                });
                if (onSubmit) onSubmit(eventFormData);
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
                alert("Une erreur est survenue lors de la soumission.");
            }
        };

        if (isLoadingPets) {
            return (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading pets...</p>
                </div>
            );
        }

        return (
            <form className="shadow-sm ring-1 ring-gray-300 rounded-md">
                <EventDetails
                    formData={eventFormData}
                    handleChange={handleChange}
                    petOptions={petOptions}
                />

                {eventFormData.is_recurring && (
                    <EventRecurrence
                        formData={eventFormData}
                        handleChange={handleChange}
                    />
                )}

                {eventFormData.type === "feeding" && (
                    <PetDetails
                        formData={eventFormData}
                        handleChange={handleChange}
                    />
                )}

                {/* #region notes */}
                <div className="sm:col-span-6">
                    <label
                        htmlFor="notes"
                        className="block text-sm/6 font-medium text-gray-900"
                    >
                        Notes
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            value={eventFormData.notes}
                            onChange={(e) => handleChange("notes", e)}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                </div>
            </form>
        );
    },
);

export default EventForm;
