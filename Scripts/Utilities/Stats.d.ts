export declare const StandardZScores: {
    [key: number]: number;
};
export declare const determineConfidenceInterval: (sampleAverage: number, standardDeviation: number, sampleSize: number, desiredConfidenceInterval?: number) => {
    UpperBound: number;
    LowerBound: number;
};
export declare const determineProbabilityMassDistribution: (dataArray: any, numberAccessor: any) => {
    [key: number]: number;
};
export declare const determineCDF: (PartialMassDistribution: {
    [key: number]: number;
}) => Map<number, number>;
export declare const getProbabilityFromCDF: (testNumber: number, CDF: Map<number, number>) => number;
export declare const binomial: (n: number, r: number) => number;
//# sourceMappingURL=Stats.d.ts.map