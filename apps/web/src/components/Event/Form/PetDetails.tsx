import React from "react";
import { useTranslation } from "react-i18next";
import { X, Plus } from "@phosphor-icons/react";

import SingleSelect from "../../Form/SingleSelect";

interface PetDetailsProps {
    formData: EventFormData;
    pets: { value: string; label: string }[];
    handleChange: (field: string, value: unknown) => void;
}

const inputClasses =
    "block w-full bg-lin-1 border-2 border-lin-5 rounded-[12px] px-4 py-3 text-base text-[#1A1A1A] font-nunito min-h-[48px] placeholder:text-[#8E8E8E] hover:border-lin-6 focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors duration-150";

const PetDetails = ({ formData, pets, handleChange }: PetDetailsProps) => {
    const { t } = useTranslation();

    const addPetDetail = () => {
        handleChange("pets", [
            ...formData.pets,
            {
                pet_id: "",
                item: "",
                quantity: "",
                notes: "",
            },
        ]);
    };

    const removePetDetail = (index: number) => {
        const newPets = formData.pets.filter((_pet, i) => i !== index);
        handleChange("pets", newPets);
    };

    const handlePetChange = (index: number, field: string, value: string) => {
        const updatedPets = [...formData.pets];
        (updatedPets[index] as unknown as Record<string, unknown>)[field] =
            value;
        handleChange("pets", updatedPets);
    };

    return (
        <div className="space-y-4 px-1">
            <div className="flex flex-wrap gap-4">
                {formData.pets?.map((petDetail, index) => {
                    const detail = petDetail as unknown as Record<
                        string,
                        unknown
                    >;
                    return (
                        <div
                            key={index}
                            className="flex-1 min-w-[200px] max-w-[300px] border-2 border-lin-4 rounded-[16px] p-4 space-y-3 bg-lin-0 relative"
                        >
                            <button
                                type="button"
                                onClick={() => removePetDetail(index)}
                                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-danger/10 text-danger transition-colors"
                                aria-label={t("event.delete")}
                            >
                                <X size={16} weight="bold" />
                            </button>

                            <SingleSelect
                                label={t("event.pet")}
                                options={pets}
                                onChange={(value) =>
                                    handlePetChange(index, "pet_id", value)
                                }
                                value={petDetail?.id?.toString()}
                            />

                            <div>
                                <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
                                    {t("event.item")}
                                </label>
                                <input
                                    type="text"
                                    value={(detail?.item as string) ?? ""}
                                    onChange={(e) =>
                                        handlePetChange(
                                            index,
                                            "item",
                                            e.target.value,
                                        )
                                    }
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
                                    {t("event.quantity")}
                                </label>
                                <input
                                    type="text"
                                    value={(detail?.quantity as string) ?? ""}
                                    onChange={(e) =>
                                        handlePetChange(
                                            index,
                                            "quantity",
                                            e.target.value,
                                        )
                                    }
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
                                    {t("event.notes")}
                                </label>
                                <textarea
                                    value={(detail?.notes as string) ?? ""}
                                    onChange={(e) =>
                                        handlePetChange(
                                            index,
                                            "notes",
                                            e.target.value,
                                        )
                                    }
                                    rows={2}
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Add pet detail button */}
                <button
                    type="button"
                    onClick={addPetDetail}
                    className="flex-1 min-w-[200px] max-w-[300px] min-h-[120px] border-2 border-dashed border-lin-5 rounded-[16px] flex flex-col items-center justify-center gap-2 text-primary-600 hover:bg-primary-50 hover:border-primary transition-colors cursor-pointer"
                >
                    <Plus size={24} weight="bold" />
                    <span className="text-sm font-semibold">
                        {t("event.add_pet_detail")}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default PetDetails;
