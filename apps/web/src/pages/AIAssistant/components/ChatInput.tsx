import React, { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faMicrophone } from "@fortawesome/free-solid-svg-icons";

interface ChatInputProps {
    onSend: (message: string) => void;
    onVoiceStart?: () => void;
    onVoiceStop?: () => void;
    isRecording?: boolean;
    isLoading?: boolean;
    placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    onVoiceStart,
    onVoiceStop,
    isRecording = false,
    isLoading = false,
    placeholder = "Ask anything about your pets...",
}) => {
    const [message, setMessage] = useState("");
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
                            <FontAwesomeIcon icon={faMicrophone} />
                        </button>
                    )}

                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || isLoading}
                        className="p-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-md"
                        aria-label="Envoyer le message"
                    >
                        {isLoading ? (
                            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <FontAwesomeIcon icon={faPaperPlane} />
                        )}
                    </button>
                </div>

                <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                        Appuyez sur{" "}
                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                            Entrée
                        </kbd>{" "}
                        pour envoyer,{" "}
                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                            Shift
                        </kbd>{" "}
                        +{" "}
                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                            Entrée
                        </kbd>{" "}
                        pour une nouvelle ligne
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
