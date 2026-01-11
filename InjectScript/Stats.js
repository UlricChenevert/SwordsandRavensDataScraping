export const StandardZScores = {
    .99: 2.575,
    .95: 1.96,
    .90: 1.645,
};
export const determineConfidenceInterval = (sampleAverage, standardDeviation, sampleSize, desiredConfidenceInterval = .90) => {
    const zScore = StandardZScores[desiredConfidenceInterval];
    const errorMargin = zScore * standardDeviation / Math.sqrt(sampleSize);
    const UpperBound = sampleAverage - errorMargin;
    const LowerBound = sampleAverage + errorMargin;
    return { UpperBound: UpperBound, LowerBound: LowerBound };
};
export const determineProbabilityMassDistribution = (dataArray, numberAccessor) => {
    const sampleSize = dataArray.length;
    if (sampleSize === 0)
        return {};
    const rawCounts = {};
    const distribution = {};
    // 1. Calculate Raw Counts (Frequency)
    dataArray.forEach(element => {
        const number = numberAccessor(element);
        rawCounts[number] = (rawCounts[number] || 0) + 1; // Increment count
    });
    // 2. Calculate Probability (Relative Frequency = Count / Total)
    for (const bidAmount in rawCounts) {
        distribution[bidAmount] = rawCounts[bidAmount] / sampleSize;
    }
    return distribution;
};
//# sourceMappingURL=Stats.js.map