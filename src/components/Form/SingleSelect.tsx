import React from "react";
import Select from "react-select";

interface SingleSelectProps {
    label?: string | null;
    placeholder?: string | null;
    options: {
        value: string;
        label: string;
    }[];
    value: string;
    onChange: (value: string) => void;
    required?: boolean; // Notez que required est marqué comme facultatif (optionnel)
}

const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        className:
            "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6",
        borderColor: state.isFocused ? "#B38B56" : "#D1D5DB",
        borderStyle: "solid",
        boxShadow: "none",
    }),
    placeholder: (provided: any) => ({
        ...provided,
        className: "text-gray-400",
    }),
    input: (provided: any) => ({
        ...provided,
        className: "text-gray-900",
    }),
    singleValue: (provided: any) => ({
        ...provided,
        className: "text-gray-900",
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        color: "#D1D5DB", // Tailwind primary color for the dropdown arrow
    }),
    indicatorSeparator: (provided: any) => ({
        ...provided,
        backgroundColor: "#D1D5DB", // Tailwind gray-300 for separator
    }),
    menu: (provided: any) => ({
        ...provided,
        className: "mt-1 rounded-md bg-white shadow-lg",
    }),
    menuList: (provided: any) => ({
        ...provided,
        className: "py-1",
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        className: `px-3 cursor-pointer ${
            state.isSelected ? "bg-primary text-white" : "text-gray-900"
        } hover:bg-gray-100`,
    }),
};
const SingleSelect = ({
    label = null,
    options,
    value,
    onChange,
    placeholder = null,
    required = false,
}: SingleSelectProps) => {
    return (
        <div className="relative">
            {label && (
                <label
                    htmlFor="petId"
                    className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900 capitalize-first z-50"
                >
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <Select
                styles={customStyles}
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
    );
};

export default SingleSelect;
