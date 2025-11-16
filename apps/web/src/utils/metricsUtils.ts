/**
 * Metrics Analysis Utilities
 * Client-side utilities for analyzing pet health metrics
 */

/**
 * Analyze a series of metrics and return statistical analysis
 */
export function analyzeMetrics(metrics: Metric[]): MetricsAnalysis {
    if (metrics.length === 0) {
        return {
            average: 0,
            min: 0,
            max: 0,
            change: 0,
            changePercent: 0,
            trend: 'stable',
        };
    }

    const values = metrics.map((m) => m.value);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const change = lastValue - firstValue;
    const changePercent = firstValue !== 0 ? (change / firstValue) * 100 : 0;

    let trend: 'increasing' | 'decreasing' | 'stable';
    if (changePercent > 5) {
        trend = 'increasing';
    } else if (changePercent < -5) {
        trend = 'decreasing';
    } else {
        trend = 'stable';
    }

    return {
        average: parseFloat(average.toFixed(2)),
        min: parseFloat(min.toFixed(2)),
        max: parseFloat(max.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        trend,
    };
}

/**
 * Generate mock metrics data for testing
 */
export function generateMockMetrics(
    petId: string,
    metricType: 'weight' | 'temperature' | 'heart_rate' = 'weight',
    count: number = 10,
): Metric[] {
    const now = new Date();
    const metrics: Metric[] = [];

    let baseValue: number;
    let variance: number;
    let unit: string;

    switch (metricType) {
        case 'weight':
            baseValue = 15;
            variance = 2;
            unit = 'kg';
            break;
        case 'temperature':
            baseValue = 38.5;
            variance = 0.5;
            unit = '°C';
            break;
        case 'heart_rate':
            baseValue = 100;
            variance = 15;
            unit = 'bpm';
            break;
        default:
            baseValue = 10;
            variance = 2;
            unit = 'unit';
    }

    for (let i = 0; i < count; i++) {
        const daysAgo = (count - 1 - i) * 7; // Weekly measurements
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);

        // Add some trend and randomness
        const trend = (i / count) * variance * 0.5; // Slight upward trend
        const random = (Math.random() - 0.5) * variance;
        const value = baseValue + trend + random;

        metrics.push({
            id: `mock-${i}`,
            pet_id: petId,
            metric_type: metricType,
            value: parseFloat(value.toFixed(2)),
            unit,
            measured_at: date.toISOString().split('T')[0],
        });
    }

    return metrics;
}

/**
 * Check if a weight change is concerning based on pet species
 */
export function isWeightChangeConcerning(
    changePercent: number,
    species: 'dog' | 'cat',
): {
    isConcerning: boolean;
    severity: 'low' | 'medium' | 'high';
    message: string;
} {
    const absChange = Math.abs(changePercent);

    // Weight loss thresholds
    if (changePercent < 0) {
        if (absChange > 15) {
            return {
                isConcerning: true,
                severity: 'high',
                message: `Perte de poids importante (${changePercent.toFixed(1)}%). Consultez rapidement un vétérinaire.`,
            };
        } else if (absChange > 10) {
            return {
                isConcerning: true,
                severity: 'medium',
                message: `Perte de poids notable (${changePercent.toFixed(1)}%). Surveillez l'évolution et consultez un vétérinaire si cela continue.`,
            };
        } else if (absChange > 5) {
            return {
                isConcerning: true,
                severity: 'low',
                message: `Légère perte de poids (${changePercent.toFixed(1)}%). Surveillez l'alimentation et l'activité.`,
            };
        }
    }

    // Weight gain thresholds
    if (changePercent > 0) {
        if (absChange > 20) {
            return {
                isConcerning: true,
                severity: 'high',
                message: `Prise de poids excessive (${changePercent.toFixed(1)}%). Consultez un vétérinaire pour ajuster l'alimentation.`,
            };
        } else if (absChange > 15) {
            return {
                isConcerning: true,
                severity: 'medium',
                message: `Prise de poids importante (${changePercent.toFixed(1)}%). Considérez une réduction des portions ou plus d'exercice.`,
            };
        } else if (absChange > 10) {
            return {
                isConcerning: true,
                severity: 'low',
                message: `Prise de poids notable (${changePercent.toFixed(1)}%). Surveillez l'alimentation.`,
            };
        }
    }

    return {
        isConcerning: false,
        severity: 'low',
        message: `Poids stable (${changePercent.toFixed(1)}%). Continuez ainsi !`,
    };
}

/**
 * Calculate ideal weight range for a pet
 */
export function getIdealWeightRange(
    species: 'dog' | 'cat',
    breed?: string,
): {
    min: number;
    max: number;
    unit: string;
} | null {
    // This is a simplified version - in reality, this would be breed-specific
    if (species === 'dog') {
        return {
            min: 10,
            max: 25,
            unit: 'kg',
        };
    }

    if (species === 'cat') {
        return {
            min: 3.5,
            max: 5.5,
            unit: 'kg',
        };
    }

    return null;
}

/**
 * Format metric value with appropriate precision
 */
export function formatMetricValue(
    value: number,
    metricType: string,
): string {
    switch (metricType) {
        case 'weight':
            return `${value.toFixed(2)} kg`;
        case 'temperature':
            return `${value.toFixed(1)} °C`;
        case 'heart_rate':
            return `${Math.round(value)} bpm`;
        default:
            return value.toFixed(2);
    }
}

/**
 * Get metric type label in French
 */
export function getMetricTypeLabel(metricType: string): string {
    const labels: Record<string, string> = {
        weight: 'Poids',
        temperature: 'Température',
        heart_rate: 'Fréquence cardiaque',
        custom: 'Métrique personnalisée',
    };

    return labels[metricType] || metricType;
}
