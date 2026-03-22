import React from "react";
import { ChartLine, ArrowUp, ArrowDown, ArrowRight } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

interface MetricsChartProps {
    metricsHistory: MetricsHistory;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ metricsHistory }) => {
    const { metrics, analysis, metricType } = metricsHistory;

    const getTrendColor = () => {
        switch (analysis.trend) {
            case "increasing":
                return "text-red-600 dark:text-red-400";
            case "decreasing":
                return "text-blue-600 dark:text-blue-400";
            default:
                return "text-green-600 dark:text-green-400";
        }
    };

    const getTrendIcon = (): Icon => {
        switch (analysis.trend) {
            case "increasing":
                return ArrowUp;
            case "decreasing":
                return ArrowDown;
            default:
                return ArrowRight;
        }
    };

    const getMetricLabel = () => {
        switch (metricType) {
            case "weight":
                return "Poids";
            case "temperature":
                return "Température";
            case "heart_rate":
                return "Fréquence cardiaque";
            default:
                return "Métrique";
        }
    };

    const normalizeValue = (value: number) => {
        const range = analysis.max - analysis.min;
        if (range === 0) return 50;
        return ((value - analysis.min) / range) * 100;
    };

    const TrendIcon = getTrendIcon();

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mt-3">
            <div className="flex items-center gap-2 mb-4">
                <ChartLine
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                    Évolution du {getMetricLabel()}
                </h4>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Moyenne
                    </p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                        {analysis.average}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {metrics[0]?.unit}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Min
                    </p>
                    <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                        {analysis.min}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {metrics[0]?.unit}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Max
                    </p>
                    <p className="text-base font-bold text-red-600 dark:text-red-400">
                        {analysis.max}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {metrics[0]?.unit}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Évolution
                    </p>
                    <p
                        className={`text-base font-bold flex items-center justify-center gap-1 ${getTrendColor()}`}
                    >
                        <TrendIcon size={14} />
                        {analysis.changePercent > 0 ? "+" : ""}
                        {analysis.changePercent}%
                    </p>
                </div>
            </div>

            {/* Simple Line Chart */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="relative h-32">
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 w-12">
                        <span>{analysis.max}</span>
                        <span>
                            {((analysis.max + analysis.min) / 2).toFixed(1)}
                        </span>
                        <span>{analysis.min}</span>
                    </div>

                    <div className="ml-12 relative h-full">
                        <div className="absolute inset-0 flex flex-col justify-between">
                            <div className="border-t border-gray-200 dark:border-gray-700" />
                            <div className="border-t border-gray-200 dark:border-gray-700" />
                            <div className="border-t border-gray-200 dark:border-gray-700" />
                        </div>

                        <svg
                            className="w-full h-full"
                            preserveAspectRatio="none"
                            viewBox="0 0 100 100"
                        >
                            <polyline
                                points={metrics
                                    .map((metric, index) => {
                                        const x =
                                            (index / (metrics.length - 1)) *
                                            100;
                                        const y =
                                            100 - normalizeValue(metric.value);
                                        return `${x},${y}`;
                                    })
                                    .join(" ")}
                                stroke="#8b5cf6"
                                strokeWidth="2"
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                            />

                            {metrics.map((metric, index) => {
                                const x = (index / (metrics.length - 1)) * 100;
                                const y = 100 - normalizeValue(metric.value);
                                return (
                                    <circle
                                        key={index}
                                        cx={x}
                                        cy={y}
                                        r="2"
                                        fill="#8b5cf6"
                                        vectorEffect="non-scaling-stroke"
                                    >
                                        <title>
                                            {new Date(
                                                metric.measured_at,
                                            ).toLocaleDateString("fr-FR")}
                                            : {metric.value} {metric.unit}
                                        </title>
                                    </circle>
                                );
                            })}
                        </svg>
                    </div>
                </div>

                <div className="ml-12 mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                        {new Date(metrics[0].measured_at).toLocaleDateString(
                            "fr-FR",
                            {
                                day: "numeric",
                                month: "short",
                            },
                        )}
                    </span>
                    {metrics.length > 2 && (
                        <span>
                            {new Date(
                                metrics[
                                    Math.floor(metrics.length / 2)
                                ].measured_at,
                            ).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                            })}
                        </span>
                    )}
                    <span>
                        {new Date(
                            metrics[metrics.length - 1].measured_at,
                        ).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                        })}
                    </span>
                </div>
            </div>

            {analysis.trend !== "stable" && (
                <div
                    className={`mt-3 p-3 rounded-lg ${
                        analysis.trend === "increasing"
                            ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    }`}
                >
                    <p className="text-xs font-semibold mb-1">
                        {analysis.trend === "increasing"
                            ? "📈 Tendance à la hausse"
                            : "📉 Tendance à la baisse"}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                        Variation de{" "}
                        <strong>
                            {analysis.change > 0 ? "+" : ""}
                            {analysis.change} {metrics[0]?.unit}
                        </strong>{" "}
                        sur la période ({analysis.changePercent > 0 ? "+" : ""}
                        {analysis.changePercent}%)
                    </p>
                </div>
            )}
        </div>
    );
};

export default MetricsChart;
