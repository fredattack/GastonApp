import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface CommandBarInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onRecordToggle: () => void;
    isRecording: boolean;
    isLoading: boolean;
}

const CommandBarInput: React.FC<CommandBarInputProps> = ({
    value,
    onChange,
    onSubmit,
    onRecordToggle,
    isRecording,
    isLoading,
}) => {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && value.trim()) {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("Ask anything about your pets...")}
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-base outline-none"
                disabled={isLoading}
            />
            <button
                type="button"
                onClick={onRecordToggle}
                className={`p-2 rounded-full transition-colors ${
                    isRecording
                        ? "bg-red-500 text-white animate-pulse"
                        : "text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                aria-label={
                    isRecording ? t("Stop recording") : t("Start recording")
                }
            >
                <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </button>
            {isLoading && (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 rounded font-mono">
                ESC
            </kbd>
        </div>
    );
};

export default CommandBarInput;
