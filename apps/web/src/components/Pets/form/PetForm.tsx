import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { modelService } from "../../../services";
import { useToast } from "../../../providers/ToastProvider";
import {
    validatePetForm,
    formatValidationErrors,
} from "../../../utils/validation";

interface PetFormProps {
    petFormData: PetFormData;
    onSubmit?: (data: PetFormData) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onCancel?: () => void;
    submitable?: boolean;
}

const PetForm = forwardRef<{ handleSubmit: () => Promise<void> }, PetFormProps>(
    (
        { petFormData, onSubmit, onChange, onCancel, submitable = false },
        ref,
    ) => {
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
                // Validate form data
                const validation = validatePetForm(petFormData);

                if (!validation.isValid) {
                    const errorMessage = formatValidationErrors(validation.errors);
                    addToast({
                        message: errorMessage,
                        type: "error",
                    });
                    return;
                }

                if (petFormData?.id) {
                    // Update
                    await modelService.update(
                        "pets",
                        petFormData.id,
                        petFormData,
                    );
                    addToast({
                        message: "Pet updated successfully!",
                        type: "success",
                    });
                } else {
                    // Create
                    const newId = await modelService.add("pets", petFormData);
                    addToast({
                        message: `Pet created successfully! ID: ${newId}`,
                        type: "success",
                    });
                }

                if (onSubmit) {
                    onSubmit(petFormData);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                addToast({
                    message: "An error occurred while saving the pet",
                    type: "error",
                });
            }
        };

        useImperativeHandle(ref, () => ({
            handleSubmit,
        }));

        return (
            <div>
                <h6 className="text-lg font-bold mb-5">
                    Informations générales
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="name">Nom*</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={petFormData?.name}
                            onChange={onChange}
                            placeholder="Entrez le nom de l'animal"
                            className="form-input"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="species">Espèce*</label>
                        <select
                            id="species"
                            name="species"
                            value={petFormData?.species}
                            onChange={onChange}
                            className="form-select text-white-dark"
                        >
                            <option value="dog">Chien</option>
                            <option value="cat">Chat</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="breed">Race</label>
                        <input
                            id="breed"
                            name="breed"
                            type="text"
                            value={petFormData?.breed}
                            onChange={onChange}
                            placeholder="Entrez la race"
                            className="form-input"
                        />
                    </div>

                    <div>
                        <label htmlFor="birthDate">Date de naissance</label>
                        <input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            value={formatBirthDate(
                                petFormData?.birthDate ?? null,
                            )}
                            onChange={onChange}
                            className="form-input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="isActive"
                            className="inline-flex items-center"
                        >
                            <input
                                id="isActive"
                                name="isActive"
                                type="checkbox"
                                checked={petFormData?.isActive}
                                onChange={onChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Actif</span>
                        </label>
                    </div>
                </div>

                {submitable && (
                    <div className="flex justify-end space-x-4 mt-5">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn-secondary"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            onSubmit={(e) => {
                                e.preventDefault();
                                onSubmit(petFormData);
                            }}
                            className="btn btn-primary"
                        >
                            Enregistrer
                        </button>
                    </div>
                )}
            </div>
        );
    },
);

export default PetForm;
