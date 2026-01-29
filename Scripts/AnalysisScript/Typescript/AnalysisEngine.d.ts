import { AnalyzedData, IGameDataAnalyzer, ITrialCombination, analysisTypes } from "../../Contracts/AnalysisContracts.js";
import { ScrapedData } from "../../Contracts/ExtractionContracts.js";
export declare class GameDataAnalyzer<AnalyzedObject extends object> {
    analyzer: IGameDataAnalyzer<AnalyzedObject>;
    trialCombination: ITrialCombination<AnalyzedObject>;
    constructor(analyzer: IGameDataAnalyzer<AnalyzedObject>, trialCombination: ITrialCombination<AnalyzedObject>);
}
export declare const AnalyzeData: (uniqueTrials: ScrapedData[], analysisFunctions: GameDataAnalyzer<analysisTypes>[], analyzedData: AnalyzedData) => Partial<import("../../Contracts/AnalysisContracts.js").BattleAreaAnalysis & import("../../Contracts/AnalysisContracts.js").BattleStrategyAnalysis & import("../../Contracts/AnalysisContracts.js").ProvinceDistributionAnalysis & import("../../Contracts/AnalysisContracts.js").ProvinceControlAnalysis & import("../../Contracts/AnalysisContracts.js").ArmyCompositionAnalysis & import("../../Contracts/AnalysisContracts.js").ProvinceCountTimelineAnalysis & import("../../Contracts/AnalysisContracts.js").MiliaryFactionStatistics & import("../../Contracts/ExtractionContracts.js").BidAnalysisData & import("../../Contracts/AnalysisContracts.js").CardChoiceAnalysisData>;
//# sourceMappingURL=AnalysisEngine.d.ts.map