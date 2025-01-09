import React, { useState } from "react";

interface ToggleProps {
    label: string;
    labelPosition?: "left" | "right";
    onChange: (isEnabled: boolean) => void;
    initialState?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ label, labelPosition = "right", onChange,  initialState = false }) => {
    const [isEnabled, setIsEnabled] = useState(initialState);

    const handleToggle = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        onChange(newState);
    };

    return (
        <div className="flex items-center">
            {labelPosition === "left" && (
                <span className="mr-2 text-sm font-medium text-gray-700">{label}</span>
            )}

            <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                    isEnabled ? "bg-indigo-600" : "bg-gray-200"
                }`}
                onClick={handleToggle}
            >
                <span className="sr-only">{label}</span>
                <span
                    className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                >
          <span
              className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in ${
                  isEnabled ? "opacity-0" : "opacity-100"
              }`}
              aria-hidden="true"
          >
            <svg
                className="h-3 w-3 text-gray-400"
                fill="none"
                viewBox="0 0 12 12"
            >
              <path
                  d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
              />
            </svg>
          </span>
          <span
              className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in ${
                  isEnabled ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
          >
            <svg
                className="h-3 w-3 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 12 12"
            >
              <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
            </svg>
          </span>
        </span>
            </button>

            {labelPosition === "right" && (
                <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
            )}
        </div>
    );
};

export default Toggle;
