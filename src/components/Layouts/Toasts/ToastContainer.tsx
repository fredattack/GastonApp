import React, { FC } from "react";
import { Toast } from "../../../providers/ToastProvider";

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

const ToastContainer: FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map(({ id, message, type, action, actionLabel }) => (
                <div
                    key={id}
                    className={`flex items-center justify-between px-4 py-3 rounded-md shadow-lg text-white ${type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"}`}
                >
                    <span>{message}</span>
                    <div className="flex items-center space-x-2">
                        {action && actionLabel && (
                            <button
                                onClick={() => {
                                    action();
                                    onRemove(id);
                                }}
                                className="text-sm underline"
                            >
                                {actionLabel}
                            </button>
                        )}
                        <button
                            onClick={() => onRemove(id)}
                            className="ml-2 text-xl"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
