import React from "react";
import { ForkKnife, WarningOctagon } from "@phosphor-icons/react";
import DataBlockRenderer from "../DataBlockRenderer";

interface NutritionResponseRendererProps {
    content: string;
    blocks?: StructuredBlock[];
    aiResponse?: AIResponse;
}

const NutritionResponseRenderer: React.FC<NutritionResponseRendererProps> = ({
    content,
    blocks,
}) => {
    return (
        <div className="space-y-3">
            {content && (
                <div className="flex items-start gap-2">
                    <ForkKnife
                        size={18}
                        className="text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                        {content}
                    </p>
                </div>
            )}
            {blocks && blocks.length > 0 && (
                <div className="space-y-2">
                    {blocks.map((block) => {
                        if (block.type === "nutrition_chart") {
                            return (
                                <NutritionChart
                                    key={block.id}
                                    data={block.data}
                                />
                            );
                        }
                        if (block.type === "toxic_foods") {
                            return (
                                <ToxicFoodsAlert
                                    key={block.id}
                                    foods={block.data.foods as string[]}
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

const NutritionChart: React.FC<{ data: Record<string, unknown> }> = ({
    data,
}) => {
    const dailyCalories = data.dailyCalories as number | undefined;
    const protein = data.protein as number | undefined;
    const fat = data.fat as number | undefined;
    const carbs = data.carbs as number | undefined;

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
            {dailyCalories && (
                <div className="text-center mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Calories quotidiennes
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dailyCalories} kcal
                    </p>
                </div>
            )}
            {(protein || fat || carbs) && (
                <div className="grid grid-cols-3 gap-2">
                    {protein && (
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Protéines
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {protein}g
                            </p>
                        </div>
                    )}
                    {fat && (
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Lipides
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {fat}g
                            </p>
                        </div>
                    )}
                    {carbs && (
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Glucides
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {carbs}g
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ToxicFoodsAlert: React.FC<{ foods: string[] }> = ({ foods }) => {
    return (
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
                <WarningOctagon
                    size={16}
                    weight="fill"
                    className="text-red-600 dark:text-red-400"
                />
                <span className="text-xs font-semibold text-red-800 dark:text-red-200">
                    Aliments toxiques
                </span>
            </div>
            <div className="flex flex-wrap gap-1">
                {foods.map((food, index) => (
                    <span
                        key={index}
                        className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded"
                    >
                        {food}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default NutritionResponseRenderer;
