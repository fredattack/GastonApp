import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MagnifyingGlass, Microphone } from "@phosphor-icons/react";

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
            <MagnifyingGlass
                size={20}
                className="text-gray-400 flex-shrink-0"
            />
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
                <Microphone size={20} />
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
