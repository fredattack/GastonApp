import React from "react";
import Select from "react-select";

interface SingleSelectProps {
    label?: string | null;
    placeholder?: string | null;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    required?: boolean; // Notez que required est marqué comme facultatif (optionnel)
}

const SingleSelect = ({
    label = null,
    options,
    value,
    onChange,
    placeholder = null,
    required = false, // Doit être ici
}: SingleSelectProps) => {
    return (
        <div>
            {label && (
                <label
                    htmlFor="petId"
                    className="block text-sm/6 font-medium text-gray-900"
                >
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="mt-2">
                <Select
                    required={required}
                    id="petId"
                    value={options.find((option) => option.value === value)}
                    onChange={(selectedOption) =>
                        selectedOption?.value !== undefined &&
                        onChange(selectedOption.value)
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

export default SingleSelect;
