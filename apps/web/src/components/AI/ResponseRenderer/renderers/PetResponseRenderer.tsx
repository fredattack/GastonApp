import React from "react";
import { PawPrint, Heart, Syringe } from "@phosphor-icons/react";
import DataBlockRenderer from "../DataBlockRenderer";

interface PetResponseRendererProps {
    content: string;
    blocks?: StructuredBlock[];
    aiResponse?: AIResponse;
}

const PetResponseRenderer: React.FC<PetResponseRendererProps> = ({
    content,
    blocks,
}) => {
    return (
        <div className="space-y-3">
            {content && (
                <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                    {content}
                </p>
            )}
            {blocks && blocks.length > 0 && (
                <div className="space-y-2">
                    {blocks.map((block) => {
                        if (block.type === "pet_card") {
                            return <PetCard key={block.id} data={block.data} />;
                        }
                        if (block.type === "health_timeline") {
                            return (
                                <HealthTimeline
                                    key={block.id}
                                    events={
                                        block.data.events as Array<{
                                            date: string;
                                            label: string;
                                            type: string;
                                        }>
                                    }
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

const PetCard: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
    const name = data.name as string;
    const species = data.species as string;
    const breed = data.breed as string;
    const photo = data.photo as string | undefined;
    const vaccinations = data.vaccinations as string[] | undefined;
    const lastVetVisit = data.lastVetVisit as string | undefined;

    return (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
                {photo ? (
                    <img
                        src={photo}
                        alt={name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <PawPrint
                            size={24}
                            className="text-primary"
                        />
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {species}
                        {breed ? ` - ${breed}` : ""}
                    </p>
                </div>
            </div>

            {vaccinations && vaccinations.length > 0 && (
                <div className="mb-2">
                    <div className="flex items-center gap-1 mb-1">
                        <Syringe
                            size={14}
                            className="text-green-600 dark:text-green-400"
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Vaccins
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {vaccinations.map((v, i) => (
                            <span
                                key={i}
                                className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full"
                            >
                                {v}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {lastVetVisit && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Heart size={12} />
                    <span>Dernier veto : {lastVetVisit}</span>
                </div>
            )}
        </div>
    );
};

const HealthTimeline: React.FC<{
    events: Array<{ date: string; label: string; type: string }>;
}> = ({ events }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
                {events.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-2.5 h-2.5 rounded-full ${
                                    event.type === "medical"
                                        ? "bg-red-400"
                                        : event.type === "vaccination"
                                          ? "bg-green-400"
                                          : "bg-blue-400"
                                }`}
                            />
                            {index < events.length - 1 && (
                                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
                            )}
                        </div>
                        <div className="flex-1 -mt-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {event.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {event.date}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PetResponseRenderer;
