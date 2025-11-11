import React from "react";
import Select from "react-select";

interface MultiSelectProps {
    label?: string | null;
    placeholder?: string | null;
    options: {
        value: string;
        label: string;
    }[];
    value: string[]; // Tableau de valeurs sélectionnées
    onChange: (value: string[]) => void; // Retourne un tableau de valeurs sélectionnées
    required?: boolean; // Optionnel
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
    multiValue: (
        styles: any,
        {
            data,
        }: {
            data: any;
        },
    ) => {
        return {
            ...styles,
            backgroundColor: "#B38B56",
            borderRadius: "0.375rem",
        };
    },
};
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
        <div className="relative">
            {label && (
                <label
                    htmlFor="multiSelect"
                    className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900 capitalize-first z-10"
                >
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <Select
                styles={customStyles}
                isMulti // Active le mode MultiSelect
                required={required}
                id="multiSelect"
                defaultValue={options.filter((option) =>
                    value.includes(option.value),
                )} // Définit les options sélectionnées
                onChange={
                    (selectedOptions) =>
                        onChange(selectedOptions.map((option) => option.value)) // Retourne un tableau des valeurs
                }
                options={options}
                placeholder={placeholder ?? "Sélectionner..."}
                className="react-select-container"
                classNamePrefix="react-select"
            />
        </div>
    );
};

export default MultiSelect;
