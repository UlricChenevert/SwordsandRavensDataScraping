export class GameDataAnalyzer {
    analyzer;
    trialCombination;
    constructor(analyzer, trialCombination) {
        this.analyzer = analyzer;
        this.trialCombination = trialCombination;
    }
}
export const AnalyzeData = (uniqueTrials, analysisFunctions, analyzedData) => {
    analysisFunctions.forEach((analysisFunction) => {
        const trialData = uniqueTrials.map(trial => analysisFunction.analyzer(trial));
        analysisFunction.trialCombination(trialData, analyzedData);
    });
    return analyzedData;
};
//# sourceMappingURL=AnalysisEngine.js.map