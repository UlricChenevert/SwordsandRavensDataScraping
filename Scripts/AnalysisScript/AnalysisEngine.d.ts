import { analysisTypes, IGameDataAnalyzer, ITrialCombination } from "../Contracts/AnalysisContracts.js";
import { ScrapedData } from "../Contracts/ExtractionContracts.js";
export declare class GameDataAnalyzer<AnalyzedObject extends object> {
    analyzer: IGameDataAnalyzer<AnalyzedObject>;
    trialCombination: ITrialCombination<AnalyzedObject>;
    constructor(analyzer: IGameDataAnalyzer<AnalyzedObject>, trialCombination: ITrialCombination<AnalyzedObject>);
}
export declare const AnalyzeData: (uniqueTrials: ScrapedData[], analysisFunctions: GameDataAnalyzer<analysisTypes>[]) => void;
//# sourceMappingURL=AnalysisEngine.d.ts.map