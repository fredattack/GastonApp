import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";

import { usePets } from "../../../contexts/PetsContext";
import { modelService } from "../../../services";
import { useToast } from "../../../providers/ToastProvider";

import EventDetails from "./EventDetails";
import EventRecurrence from "./EventRecurrence";
import PetDetails from "./PetDetails";
import { EventTypes } from "../../../enums/EventTypes";

interface EventFormProps {
    event: EventFormData;
    onSubmit?: (data: EventFormData) => void;
    onChange?: (data: EventFormData) => void;
    onCancel?: () => void;
    submittable?: boolean;
    submitable?: boolean;
}

const EventForm = forwardRef(
    (
        {
            event,
            onSubmit,
            onChange,
            onCancel,
            submittable = false,
            submitable,
        }: EventFormProps,
        ref,
    ) => {
        const { t } = useTranslation();
        const { addToast } = useToast();
        const { pets } = usePets();

        const petOptions = pets?.map((pet) => ({
            value: pet.id.toString(),
            label: pet.name,
        }));

        const buildFormData = (src: EventFormData): EventFormData => ({
            id: src?.id || null,
            master_id: src?.master_id || null,
            petId: src?.petId || "",
            type: src?.type || "",
            start_date: src?.start_date || "",
            title: src?.title || "",
            end_date: src?.end_date || "",
            is_recurring: src?.is_recurring || false,
            is_full_day: src?.is_full_day || false,
            recurrence: src?.recurrence || {
                frequency_type: "",
                frequency: 1,
                days: [],
                end_date: "",
                occurrences: 0,
            },
            pets: src?.pets || [],
            notes: src?.notes || "",
            is_done: src?.is_done || false,
        });

        const [eventFormData, setEventFormData] = useState<EventFormData>(
            buildFormData(event),
        );

        // Re-sync when event prop changes (fixes pre-fill bug)
        useEffect(() => {
            setEventFormData(buildFormData(event));
        }, [event]);

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

        function handelChangeRecurrence(
            key: string,
            value: string | string[] | number | boolean,
        ) {
            setEventFormData((prev) => ({
                ...prev,
                recurrence: {
                    ...prev.recurrence,
                    [key]: value,
                },
            }));
        }

        const handleSubmit = async (e?: React.FormEvent) => {
            try {
                if (!eventFormData.type || !eventFormData.start_date) {
                    addToast({
                        message:
                            "Les champs Type et Date de début sont obligatoires !",
                        type: "error",
                    });
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
                    message: eventFormData.id
                        ? t("event.updated_success")
                        : t("event.created_success"),
                    type: "success",
                });
                if (onSubmit) onSubmit(eventFormData);
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
                addToast({
                    message: "Une erreur est survenue lors de la soumission.",
                    type: "error",
                });
            }
        };

        return (
            <form className="bg-lin-0 rounded-[20px] border border-lin-4 space-y-6 py-6 px-5">
                <EventDetails
                    formData={eventFormData}
                    handleChange={handleChange}
                    petOptions={petOptions}
                />

                <div className="border-t border-lin-4 pt-5">
                    <EventRecurrence
                        key={eventFormData.recurrence.toString()}
                        formData={eventFormData}
                        handleChange={handleChange}
                        handelChangeRecurrence={handelChangeRecurrence}
                    />
                </div>

                {[EventTypes.Feeding, EventTypes.Medical].includes(
                    eventFormData.type,
                ) && (
                    <div className="border-t border-lin-4 pt-5">
                        <PetDetails
                            pets={petOptions}
                            formData={eventFormData}
                            handleChange={handleChange}
                        />
                    </div>
                )}

                {/* Notes */}
                <div className="border-t border-lin-4 pt-5 px-1">
                    <label
                        htmlFor="notes"
                        className="block text-sm font-semibold text-[#4A4A4A] mb-2"
                    >
                        {t("event.notes")}
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={eventFormData.notes}
                        onChange={(e) =>
                            handleChange("notes", e.target.value)
                        }
                        className="block w-full bg-lin-1 border-2 border-lin-5 rounded-[12px] px-4 py-3 text-base text-[#1A1A1A] font-nunito min-h-[48px] placeholder:text-[#8E8E8E] hover:border-lin-6 focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors duration-150"
                    />
                </div>

                {/* Action buttons */}
                {(submittable || submitable) && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-lin-4 px-1">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-3 min-h-[48px] rounded-full border-2 border-primary text-primary-700 font-semibold hover:bg-primary-50 transition-colors focus-visible:ring-[3px] focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                                {t("event.cancel")}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-8 py-3 min-h-[48px] rounded-full bg-[#1A1A1A] text-white font-semibold hover:bg-[#333] shadow-ds-md hover:shadow-ds-lg transition-all focus-visible:ring-[3px] focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            {t("event.save")}
                        </button>
                    </div>
                )}
            </form>
        );
    },
);

export default EventForm;
