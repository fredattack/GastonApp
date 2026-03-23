import React, {
    useState,
    useRef,
    useEffect,
    KeyboardEvent,
    ChangeEvent,
} from "react";
import { PaperPlaneTilt, Microphone } from "@phosphor-icons/react";

interface ChatInputProps {
    onSend: (message: string) => void;
    onVoiceStart?: () => void;
    onVoiceStop?: () => void;
    isRecording?: boolean;
    isLoading?: boolean;
    placeholder?: string;
    externalValue?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    onVoiceStart,
    onVoiceStop,
    isRecording = false,
    isLoading = false,
    placeholder = "Ask anything about your pets...",
    externalValue,
}) => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (externalValue) {
            setMessage(externalValue);
            adjustTextareaHeight();
        }
    }, [externalValue]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        adjustTextareaHeight();
    };

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    };

    const handleSend = () => {
        if (message.trim() && !isLoading) {
            onSend(message.trim());
            setMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleVoiceClick = () => {
        if (isRecording && onVoiceStop) {
            onVoiceStop();
        } else if (onVoiceStart) {
            onVoiceStart();
        }
    };

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-t from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-4 shadow-lg">
            <div className="max-w-4xl mx-auto">
                <div className="flex gap-3 items-end">
                    <div className="flex-1 relative group">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={isLoading}
                            rows={1}
                            className="w-full resize-none rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md group-focus-within:shadow-lg"
                            style={{ maxHeight: "200px" }}
                            aria-label="Message input"
                        />
                    </div>

                    {onVoiceStart && onVoiceStop && (
                        <button
                            onClick={handleVoiceClick}
                            disabled={isLoading}
                            className={`p-3 rounded-xl transition-all duration-200 shadow-md ${
                                isRecording
                                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:scale-105 animate-pulse"
                                    : "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:scale-105"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            aria-label={
                                isRecording
                                    ? "Arrêter l'enregistrement"
                                    : "Démarrer l'enregistrement"
                            }
                        >
                            <Microphone size={20} />
                        </button>
                    )}

                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || isLoading}
                        className="p-3 rounded-xl bg-primary hover:bg-primary/90 text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-md"
                        aria-label="Envoyer le message"
                    >
                        {isLoading ? (
                            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <PaperPlaneTilt size={20} />
                        )}
                    </button>
                </div>

                <div className="mt-1.5 text-[10px] text-center text-gray-400 dark:text-gray-500">
                    <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono">
                        Entrée
                    </kbd>{" "}
                    envoyer{" "}
                    <span className="mx-1">·</span>{" "}
                    <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono">
                        Shift+Entrée
                    </kbd>{" "}
                    nouvelle ligne
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
