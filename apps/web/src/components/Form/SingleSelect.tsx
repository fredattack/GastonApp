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
    required?: boolean;
}

const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: "#F9F7F4",
        borderWidth: "2px",
        borderColor: state.isFocused ? "#8FA998" : "#E0D8C3",
        borderRadius: "12px",
        minHeight: "48px",
        boxShadow: state.isFocused
            ? "0 0 0 3px rgba(143, 169, 152, 0.1)"
            : "none",
        "&:hover": {
            borderColor: "#D6CBB5",
        },
        fontFamily: "'Nunito', sans-serif",
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: "#8E8E8E",
    }),
    input: (provided: any) => ({
        ...provided,
        color: "#1A1A1A",
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: "#1A1A1A",
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        color: "#A99D85",
    }),
    indicatorSeparator: (provided: any) => ({
        ...provided,
        backgroundColor: "#E0D8C3",
    }),
    menu: (provided: any) => ({
        ...provided,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow:
            "0 4px 8px 0 rgba(143, 169, 152, 0.12), 0 2px 4px 0 rgba(143, 169, 152, 0.06)",
        border: "1px solid #E9E3D0",
    }),
    menuList: (provided: any) => ({
        ...provided,
        padding: "4px",
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        borderRadius: "8px",
        cursor: "pointer",
        minHeight: "44px",
        display: "flex",
        alignItems: "center",
        backgroundColor: state.isSelected
            ? "#8FA998"
            : state.isFocused
              ? "#F4F7F5"
              : "transparent",
        color: state.isSelected ? "#FFFFFF" : "#1A1A1A",
        "&:active": {
            backgroundColor: "#E3EBE7",
        },
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
        <div>
            {label && (
                <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">
                    {label}
                    {required && (
                        <span className="text-danger ml-1">*</span>
                    )}
                </label>
            )}
            <Select
                styles={customStyles}
                required={required}
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
