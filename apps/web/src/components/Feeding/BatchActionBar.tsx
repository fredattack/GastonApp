import React from "react";
import { Checks } from "@phosphor-icons/react";

interface BatchActionBarProps {
    label: string;
    onBatch: () => void;
    pendingCount: number;
}

const BatchActionBar: React.FC<BatchActionBarProps> = ({
    label,
    onBatch,
    pendingCount,
}) => {
    return (
        <button
            onClick={onBatch}
            className="
                w-full flex items-center justify-center gap-2 py-3 px-4
                bg-primary/10 hover:bg-primary/20 active:bg-primary/30
                text-primary font-medium text-sm rounded-xl
                transition-all duration-200 min-h-[44px]
                border border-dashed border-primary/30
            "
            aria-label={`${label} (${pendingCount} restants)`}
        >
            <Checks size={20} />
            <span>{label}</span>
            <span className="text-xs opacity-70">({pendingCount})</span>
        </button>
    );
};

export default BatchActionBar;
