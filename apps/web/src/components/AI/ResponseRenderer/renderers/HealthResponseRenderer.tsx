import React from "react";
import { Heartbeat, WarningCircle, FirstAid } from "@phosphor-icons/react";
import DataBlockRenderer from "../DataBlockRenderer";

interface HealthResponseRendererProps {
    content: string;
    blocks?: StructuredBlock[];
    aiResponse?: AIResponse;
}

const HealthResponseRenderer: React.FC<HealthResponseRendererProps> = ({
    content,
    blocks,
    aiResponse,
}) => {
    const severity = aiResponse?.healthDisclaimer?.severity;

    return (
        <div className="space-y-3">
            {severity === "critical" && (
                <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <WarningCircle
                        size={18}
                        weight="fill"
                        className="text-red-600 dark:text-red-400 flex-shrink-0"
                    />
                    <span className="text-xs font-semibold text-red-800 dark:text-red-200">
                        Consultez un vétérinaire rapidement
                    </span>
                </div>
            )}

            {content && (
                <div className="flex items-start gap-2">
                    <Heartbeat
                        size={18}
                        className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                        {content}
                    </p>
                </div>
            )}

            {blocks && blocks.length > 0 && (
                <div className="space-y-2">
                    {blocks.map((block) => {
                        if (block.type === "symptom_checklist") {
                            return (
                                <SymptomChecklist
                                    key={block.id}
                                    symptoms={
                                        block.data.symptoms as Array<{
                                            name: string;
                                            severity: string;
                                        }>
                                    }
                                />
                            );
                        }
                        if (block.type === "emergency_action") {
                            return (
                                <EmergencyAction
                                    key={block.id}
                                    message={block.data.message as string}
                                    phone={block.data.phone as string | undefined}
                                />
                            );
                        }
                        return (
                            <DataBlockRenderer key={block.id} block={block} />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const SymptomChecklist: React.FC<{
    symptoms: Array<{ name: string; severity: string }>;
}> = ({ symptoms }) => {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high":
                return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
            case "medium":
                return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
            default:
                return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="space-y-1.5">
                {symptoms.map((symptom, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between px-2 py-1.5 rounded ${getSeverityColor(symptom.severity)}`}
                    >
                        <span className="text-xs font-medium">
                            {symptom.name}
                        </span>
                        <span className="text-xs capitalize">
                            {symptom.severity}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EmergencyAction: React.FC<{
    message: string;
    phone?: string;
}> = ({ message, phone }) => {
    return (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-300 dark:border-red-800">
            <div className="flex items-start gap-2">
                <FirstAid
                    size={18}
                    weight="fill"
                    className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                />
                <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">
                        {message}
                    </p>
                    {phone && (
                        <a
                            href={`tel:${phone}`}
                            className="text-xs text-red-700 dark:text-red-300 underline mt-1 inline-block"
                        >
                            Appeler : {phone}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HealthResponseRenderer;
