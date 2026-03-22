import React from "react";

interface SkeletonCardProps {
    height?: string;
    className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
    height = "h-32",
    className = "",
}) => (
    <div
        className={`animate-pulse ${height} ${className}`}
        style={{
            backgroundColor: "#E8E5DC",
            borderRadius: "20px",
        }}
    />
);

interface SkeletonListProps {
    count?: number;
    height?: string;
    columns?: number;
    className?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
    count = 4,
    height = "h-32",
    columns = 1,
    className = "",
}) => {
    const gridClass =
        columns === 1
            ? "grid grid-cols-1 gap-4"
            : columns === 2
              ? "grid grid-cols-1 md:grid-cols-2 gap-4"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

    return (
        <div className={`${gridClass} ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} height={height} />
            ))}
        </div>
    );
};
