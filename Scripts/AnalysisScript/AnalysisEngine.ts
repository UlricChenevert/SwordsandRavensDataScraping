import { analyzeBidDistributions } from "../Analysis Modules/AnalyzeBids.js";
import { analyzePossibleCardChoice } from "../Analysis Modules/MiltaryAnalysis.js";
import { analysisTypes, IGameDataAnalyzer, ITrialCombination } from "../Contracts/AnalysisContracts.js";
import { ScrapedData } from "../Contracts/ExtractionContracts.js";

export class GameDataAnalyzer<AnalyzedObject extends object> {
    constructor(
        public analyzer : IGameDataAnalyzer<AnalyzedObject>,
        public trialCombination : ITrialCombination<AnalyzedObject>,
    ) 
    {}
}

export const AnalyzeData = (uniqueTrials : ScrapedData[], analysisFunctions : GameDataAnalyzer<analysisTypes>[]) => {
    analyzeBidDistributions(uniqueTrials[0])
    analyzePossibleCardChoice(uniqueTrials[0])

    analysisFunctions.forEach((analysisFunction)=>{
        const trialData = uniqueTrials.map(trial=>analysisFunction.analyzer(trial))

        const combinedData = analysisFunction.trialCombination(trialData)
        
        console.log(combinedData)
    })
}