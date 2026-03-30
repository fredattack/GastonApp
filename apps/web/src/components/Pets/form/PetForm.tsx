import React, {
    forwardRef,
    useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";
import { modelService } from "../../../services";
import { useToast } from "../../../providers/ToastProvider";
import {
    validatePetForm,
    formatValidationErrors,
} from "../../../utils/validation";

interface PetFormProps {
    petFormData: PetFormData;
    onSubmit?: (data: PetFormData) => void;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => void;
    onCancel?: () => void;
    submitable?: boolean;
}

const PetForm = forwardRef<{ handleSubmit: () => Promise<void> }, PetFormProps>(
    (
        { petFormData, onSubmit, onChange, onCancel, submitable = false },
        ref,
    ) => {
        const { t } = useTranslation();
        const { addToast } = useToast();

        const formatBirthDate = (
            birthDate: { seconds?: number } | string | null,
        ): string => {
            if (!birthDate) return "";
            if (typeof birthDate === "string") return birthDate;
            if (birthDate?.seconds) {
                return new Date(birthDate.seconds * 1000)
                    .toISOString()
                    .split("T")[0];
            }
            return "";
        };

        const handleSubmit = async () => {
            try {
                const validation = validatePetForm(petFormData);

                if (!validation.isValid) {
                    const errorMessage = formatValidationErrors(
                        validation.errors,
                    );
                    addToast({ message: errorMessage, type: "error" });
                    return;
                }

                if (petFormData?.id) {
                    await modelService.update("pets", petFormData.id, petFormData);
                    addToast({ message: t("pets.updated_success"), type: "success" });
                } else {
                    await modelService.add("pets", petFormData);
                    addToast({ message: t("pets.added_success"), type: "success" });
                }

                if (onSubmit) {
                    onSubmit(petFormData);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                addToast({ message: t("pets.save_error"), type: "error" });
            }
        };

        useImperativeHandle(ref, () => ({
            handleSubmit,
        }));

        const speciesOptions = [
            { value: "dog", label: t("pets.species_dog") },
            { value: "cat", label: t("pets.species_cat") },
            { value: "bird", label: t("pets.species_bird") },
            { value: "rabbit", label: t("pets.species_rabbit") },
            { value: "other", label: t("pets.species_other") },
        ];

        return (
            <div data-testid="pet-form" className="space-y-6">
                <h6 className="text-lg font-bold text-dark">
                    {t("pets.general_info")}
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Nom */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-lin-8">
                            {t("pets.name")}*
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            data-testid="pet-form-name"
                            value={petFormData?.name}
                            onChange={onChange}
                            placeholder={t("pets.name_placeholder")}
                            className="w-full px-4 py-3 text-base bg-lin-1 border-2 border-lin-5 rounded-xl text-dark placeholder:text-lin-7 focus:outline-none focus:border-primary-400 focus:shadow-[0_0_0_3px_rgba(143,169,152,0.1)] transition-all min-h-[48px]"
                            required
                        />
                    </div>

                    {/* Espece */}
                    <div className="space-y-2">
                        <label htmlFor="species" className="block text-sm font-semibold text-lin-8">
                            {t("pets.species")}*
                        </label>
                        <select
                            id="species"
                            name="species"
                            data-testid="pet-form-species"
                            value={petFormData?.species}
                            onChange={onChange}
                            className="w-full px-4 py-3 text-base bg-lin-1 border-2 border-lin-5 rounded-xl text-dark focus:outline-none focus:border-primary-400 focus:shadow-[0_0_0_3px_rgba(143,169,152,0.1)] transition-all min-h-[48px] appearance-none"
                        >
                            {speciesOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Race */}
                    <div className="space-y-2">
                        <label htmlFor="breed" className="block text-sm font-semibold text-lin-8">
                            {t("pets.breed")}
                        </label>
                        <input
                            id="breed"
                            name="breed"
                            type="text"
                            data-testid="pet-form-breed"
                            value={petFormData?.breed}
                            onChange={onChange}
                            placeholder={t("pets.breed_placeholder")}
                            className="w-full px-4 py-3 text-base bg-lin-1 border-2 border-lin-5 rounded-xl text-dark placeholder:text-lin-7 focus:outline-none focus:border-primary-400 focus:shadow-[0_0_0_3px_rgba(143,169,152,0.1)] transition-all min-h-[48px]"
                        />
                    </div>

                    {/* Date de naissance */}
                    <div className="space-y-2">
                        <label htmlFor="birthDate" className="block text-sm font-semibold text-lin-8">
                            {t("pets.birthdate")}
                        </label>
                        <input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            data-testid="pet-form-birthdate"
                            value={formatBirthDate(petFormData?.birthDate ?? null)}
                            onChange={onChange}
                            className="w-full px-4 py-3 text-base bg-lin-1 border-2 border-lin-5 rounded-xl text-dark focus:outline-none focus:border-primary-400 focus:shadow-[0_0_0_3px_rgba(143,169,152,0.1)] transition-all min-h-[48px]"
                        />
                    </div>

                    {/* Actif */}
                    <div className="flex items-center gap-3 sm:col-span-2 pt-2">
                        <label htmlFor="isActive" className="relative inline-flex items-center cursor-pointer">
                            <input
                                id="isActive"
                                name="isActive"
                                type="checkbox"
                                checked={petFormData?.isActive}
                                onChange={onChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-lin-4 rounded-full peer peer-checked:bg-primary-400 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-400 peer-focus-visible:ring-offset-2 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all peer-checked:after:translate-x-full transition-colors" />
                        </label>
                        <span className="text-sm font-medium text-dark">
                            {t("pets.is_active")}
                        </span>
                    </div>
                </div>

                {submitable && (
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            data-testid="pet-form-cancel"
                            onClick={onCancel}
                            className="px-6 py-3 text-sm font-semibold text-primary-700 bg-white border-2 border-primary-400 rounded-full hover:bg-primary-50 transition-all min-h-[48px]"
                        >
                            {t("pets.cancel")}
                        </button>
                        <button
                            type="submit"
                            data-testid="pet-form-submit"
                            onSubmit={(e) => {
                                e.preventDefault();
                                onSubmit?.(petFormData);
                            }}
                            className="px-6 py-3 text-sm font-semibold text-white bg-dark rounded-full hover:bg-[#1A1A1A] hover:shadow-ds-md transition-all min-h-[48px] active:scale-[0.98]"
                        >
                            {t("pets.save")}
                        </button>
                    </div>
                )}
            </div>
        );
    },
);

export default PetForm;
