import React from "react";
import {
    PawPrint,
    Heartbeat,
    CalendarBlank,
    ForkKnife,
    CurrencyDollar,
    House,
    GearSix,
    Sparkle,
} from "@phosphor-icons/react";

interface RoutingIndicatorProps {
    agentType: AIAgentType;
    isVisible: boolean;
}

const AGENT_CONFIG: Record<
    AIAgentType,
    { label: string; icon: React.ElementType; color: string }
> = {
    pet: { label: "Assistant animaux", icon: PawPrint, color: "text-emerald-600 dark:text-emerald-400" },
    health: { label: "Assistant santé", icon: Heartbeat, color: "text-red-600 dark:text-red-400" },
    schedule: { label: "Assistant planning", icon: CalendarBlank, color: "text-blue-600 dark:text-blue-400" },
    nutrition: { label: "Assistant nutrition", icon: ForkKnife, color: "text-green-600 dark:text-green-400" },
    finance: { label: "Assistant finance", icon: CurrencyDollar, color: "text-amber-600 dark:text-amber-400" },
    household: { label: "Assistant maison", icon: House, color: "text-purple-600 dark:text-purple-400" },
    admin: { label: "Administration", icon: GearSix, color: "text-gray-600 dark:text-gray-400" },
    default: { label: "Assistant IA", icon: Sparkle, color: "text-primary" },
};

const RoutingIndicator: React.FC<RoutingIndicatorProps> = ({
    agentType,
    isVisible,
}) => {
    if (!isVisible) return null;

    const config = AGENT_CONFIG[agentType] || AGENT_CONFIG.default;
    const AgentIcon = config.icon;

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 mb-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
            <AgentIcon size={14} className={config.color} />
            <span className="text-xs text-gray-500 dark:text-gray-400">
                {config.label} traite votre demande...
            </span>
            <div className="flex gap-0.5 ml-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
            </div>
        </div>
    );
};

export default RoutingIndicator;
