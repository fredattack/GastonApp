import React from "react";
import Select from "react-select";

interface MultiSelectProps {
    label?: string | null;
    placeholder?: string | null;
    options: { value: string; label: string }[];
    value: string[]; // Tableau de valeurs sélectionnées
    onChange: (value: string[]) => void; // Retourne un tableau de valeurs sélectionnées
    required?: boolean; // Optionnel
}

const MultiSelect = ({
    label = null,
    options,
    value,
    onChange,
    placeholder = null,
    required = false, // Optionnel
}: MultiSelectProps) => {
    function getValue() {
        console.log("value", value);
        return options.filter((option) => value.includes(option.value));
    }

    return (
        <div>
            {label && (
                <label
                    htmlFor="multiSelect"
                    className="block text-sm/6 font-medium text-gray-900"
                >
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="mt-2">
                <Select
                    isMulti // Active le mode MultiSelect
                    required={required}
                    id="multiSelect"
                    defaultValue={options.filter((option) =>
                        value.includes(option.value),
                    )} // Définit les options sélectionnées
                    onChange={
                        (selectedOptions) =>
                            onChange(
                                selectedOptions.map((option) => option.value),
                            ) // Retourne un tableau des valeurs
                    }
                    options={options}
                    placeholder={placeholder ?? "Sélectionner..."}
                    className="react-select-container"
                    classNamePrefix="react-select"
                />
            </div>
        </div>
    );
};

export default MultiSelect;
