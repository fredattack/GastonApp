import React, { useState, useEffect } from "react";

interface ToggleProps {
    label: string;
    labelPosition?: "left" | "right";
    onChange: (isEnabled: boolean) => void;
    initialState?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
    label,
    labelPosition = "right",
    onChange,
    initialState = false,
}) => {
    const [isEnabled, setIsEnabled] = useState(initialState);

    useEffect(() => {
        setIsEnabled(initialState);
    }, [initialState]);

    const handleToggle = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        onChange(newState);
    };

    return (
        <div className="flex items-center gap-3">
            {labelPosition === "left" && (
                <span className="text-sm font-semibold text-[#4A4A4A]">
                    {label}
                </span>
            )}

            <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-[3px] focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isEnabled ? "bg-primary" : "bg-lin-5"
                }`}
                onClick={handleToggle}
            >
                <span className="sr-only">{label}</span>
                <span
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-ds-sm ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                />
            </button>

            {labelPosition === "right" && (
                <span className="text-sm font-semibold text-[#4A4A4A]">
                    {label}
                </span>
            )}
        </div>
    );
};

export default Toggle;
