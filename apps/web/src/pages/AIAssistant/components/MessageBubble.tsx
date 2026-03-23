import React, { useEffect, useState } from "react";
import { User, Robot, ArrowClockwise, WarningCircle } from "@phosphor-icons/react";

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const [displayedContent, setDisplayedContent] = useState("");
    const isUser = message.role === "user";
    const isStreaming = message.metadata?.isStreaming || false;

    useEffect(() => {
        if (isStreaming) {
            setDisplayedContent(message.content);
        } else {
            setDisplayedContent(message.content);
        }
    }, [message.content, isStreaming]);

    const bubbleClasses = isUser
        ? "bg-primary text-white ml-auto rounded-2xl rounded-br-sm"
        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white mr-auto rounded-2xl rounded-bl-sm";

    const alignmentClasses = isUser ? "flex-row-reverse" : "flex-row";

    return (
        <div className={`flex gap-3 mb-4 items-start ${alignmentClasses}`}>
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isUser
                        ? "bg-primary text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
                {isUser ? <User size={16} /> : <Robot size={16} />}
            </div>

            <div className={`max-w-[80%] ${bubbleClasses} px-4 py-3 shadow-sm`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {displayedContent}
                    {isStreaming && (
                        <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                    )}
                </div>

                {message.metadata?.error && (
                    <div className="mt-2 flex items-center gap-2">
                        <WarningCircle
                            size={14}
                            weight="fill"
                            className="text-red-400 flex-shrink-0"
                        />
                        <span className="text-xs text-red-400">
                            Oups, je n'ai pas pu répondre.
                        </span>
                    </div>
                )}

                <div
                    className={`text-xs mt-2 ${isUser ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}
                >
                    {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
