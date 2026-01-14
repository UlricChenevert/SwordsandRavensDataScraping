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
    
    analysisFunctions.forEach((analysisFunction)=>{
        const trialData = uniqueTrials.map(trial=>analysisFunction.analyzer(trial))

        const combinedData = analysisFunction.trialCombination(trialData)
        
        console.log(combinedData)
    })
}