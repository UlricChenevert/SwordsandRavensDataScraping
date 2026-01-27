import { analyzeBidDistributions } from "../Analysis Modules/AnalyzeBids.js";
import { analyzePossibleCardChoice } from "../Analysis Modules/MiltaryAnalysis.js";
export class GameDataAnalyzer {
    analyzer;
    trialCombination;
    constructor(analyzer, trialCombination) {
        this.analyzer = analyzer;
        this.trialCombination = trialCombination;
    }
}
export const AnalyzeData = (uniqueTrials, analysisFunctions) => {
    analyzeBidDistributions(uniqueTrials[0]);
    analyzePossibleCardChoice(uniqueTrials[0]);
    analysisFunctions.forEach((analysisFunction) => {
        const trialData = uniqueTrials.map(trial => analysisFunction.analyzer(trial));
        const combinedData = analysisFunction.trialCombination(trialData);
        console.log(combinedData);
    });
};
//# sourceMappingURL=AnalysisEngine.js.map