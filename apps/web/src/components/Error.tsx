import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Error = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="text-6xl mb-4">🐾</div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t("Oops! Something went wrong")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t("An unexpected error occurred. Please try again.")}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="btn btn-primary"
                    >
                        {t("Retry")}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="btn btn-outline-primary"
                    >
                        {t("Go Home")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Error;
