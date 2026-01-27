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
export const determineCDF = (PartialMassDistribution) => {
    const CDF = new Map();
    let totalWorkingProbably = 0;
    for (const probably of Object.entries(PartialMassDistribution)) {
        totalWorkingProbably += probably[1];
        CDF.set(parseInt(probably[0]), totalWorkingProbably);
    }
    return CDF;
};
export const getProbabilityFromCDF = (testNumber, CDF) => {
    while (CDF.get(testNumber) === undefined)
        testNumber--;
    return CDF.get(testNumber);
};
// Helper for combinations (nCr)
export const binomial = (n, r) => {
    if (r < 0 || r > n)
        return 0;
    if (r === 0 || r === n)
        return 1;
    if (r > n / 2)
        r = n - r;
    let res = 1;
    for (let i = 1; i <= r; i++) {
        res = res * (n - i + 1) / i;
    }
    return res;
};
//# sourceMappingURL=Stats.js.map