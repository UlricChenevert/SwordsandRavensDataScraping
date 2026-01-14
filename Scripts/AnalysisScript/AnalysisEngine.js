export class GameDataAnalyzer {
    analyzer;
    trialCombination;
    constructor(analyzer, trialCombination) {
        this.analyzer = analyzer;
        this.trialCombination = trialCombination;
    }
}
export const AnalyzeData = (uniqueTrials, analysisFunctions) => {
    analysisFunctions.forEach((analysisFunction) => {
        const trialData = uniqueTrials.map(trial => analysisFunction.analyzer(trial));
        const combinedData = analysisFunction.trialCombination(trialData);
        console.log(combinedData);
    });
};
//# sourceMappingURL=AnalysisEngine.js.map