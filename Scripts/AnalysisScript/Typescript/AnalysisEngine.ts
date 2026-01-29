import { analyzeBidDistributions } from "../../Analysis Modules/AnalyzeBids.js"
import { analyzePossibleCardChoice } from "../../Analysis Modules/Miltary/CardChoiceAnalysis.js"
import { AnalyzedData, IGameDataAnalyzer, ITrialCombination, analysisTypes } from "../../Contracts/AnalysisContracts.js"
import { ScrapedData } from "../../Contracts/ExtractionContracts.js"

export class GameDataAnalyzer<AnalyzedObject extends object> {
    constructor(
        public analyzer : IGameDataAnalyzer<AnalyzedObject>,
        public trialCombination : ITrialCombination<AnalyzedObject>,
    ) 
    {}
}

export const AnalyzeData = (uniqueTrials : ScrapedData[], analysisFunctions : GameDataAnalyzer<analysisTypes>[], analyzedData : AnalyzedData) => {

    analysisFunctions.forEach((analysisFunction)=>{
        const trialData = uniqueTrials.map(trial=>analysisFunction.analyzer(trial))

        analysisFunction.trialCombination(trialData, analyzedData)
    })

    return analyzedData
}