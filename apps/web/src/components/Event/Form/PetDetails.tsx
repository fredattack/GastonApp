import React from "react";

import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import SingleSelect from "../../Form/SingleSelect";

const PetDetails = ({
    formData,
    pets,
    handleChange,
}: {
    formData: any;
    pets: any;
    handleChange: (field: string, value: any) => void;
}) => {
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
        const newPets = formData.pets.filter(
            (pet: any, i: number) => i !== index,
        );
        handleChange("pets", newPets);
    };
    const handlePetChange = (index: number, field: string, value: any) => {
        console.log("index: field: value: ", index, field, value);
        const updatedPets = [...formData.pets];
        updatedPets[index][field] = value;
        handleChange("pets", updatedPets);
    };

    return (
        <div className="px-3 py-2 grid grid-cols-1 sm:grid-cols-6 gap-3">
            {formData.pets?.map((petDetail: any, index: number) => {
                return (
                    <div
                        key={index}
                        className="flex flex-col gap-2 border rounded-md px-2 pb-2"
                    >
                        <div className="flex justify-end p-1">
                            <button
                                type="button"
                                onClick={() => removePetDetail(index)}
                                className="text-red-500 hover:text-red-700 "
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <SingleSelect
                            label="pet"
                            options={pets}
                            onChange={(value) =>
                                handlePetChange(index, "pet_id", value)
                            }
                            value={petDetail?.id?.toString()}
                        />
                        <div className="relative">
                            <label
                                htmlFor="item"
                                className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900 capitalize-first"
                            >
                                {t("item")}
                            </label>
                            <input
                                id="item"
                                name="pets[${index}].item"
                                type="text"
                                value={petDetail?.item}
                                onChange={(e) =>
                                    handlePetChange(
                                        index,
                                        "item",
                                        e.target.value,
                                    )
                                }
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                            />
                        </div>
                        <div className="relative">
                            <label
                                htmlFor="quantity"
                                className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900 capitalize-first"
                            >
                                {t("quantity")}
                            </label>
                            <input
                                id="quantity"
                                name="pets[${index}].quantity"
                                type="text"
                                value={petDetail?.quantity}
                                onChange={(e) =>
                                    handlePetChange(
                                        index,
                                        "quantity",
                                        e.target.value,
                                    )
                                }
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                            />
                        </div>

                        <div className="relative">
                            <label className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900 capitalize-first">
                                Notes
                            </label>
                            <textarea
                                name={`pets[${index}].notes`}
                                value={petDetail?.notes}
                                onChange={(e) =>
                                    handlePetChange(
                                        index,
                                        "notes",
                                        e.target.value,
                                    )
                                }
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                            />
                        </div>
                    </div>
                );
            })}

            <button
                type="button"
                onClick={addPetDetail}
                className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light b"
            >
                Add Pet Detail
            </button>
        </div>
    );
};

export default PetDetails;
