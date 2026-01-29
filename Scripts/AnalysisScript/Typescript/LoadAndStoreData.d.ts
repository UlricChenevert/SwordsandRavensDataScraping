import { ScrapedData } from "../../Contracts/ExtractionContracts.js";
import { AnalyzedData } from '../../Contracts/AnalysisContracts.js';
export declare const RemoveRedundantData: (scrapedData: ScrapedData[]) => ScrapedData[];
export declare function loadScrappedData(amount?: number): Promise<ScrapedData[]>;
export declare function loadAnalyzedData(): Promise<Partial<import("../../Contracts/AnalysisContracts.js").BattleAreaAnalysis & import("../../Contracts/AnalysisContracts.js").BattleStrategyAnalysis & import("../../Contracts/AnalysisContracts.js").ProvinceDistributionAnalysis & import("../../Contracts/AnalysisContracts.js").ProvinceControlAnalysis & import("../../Contracts/AnalysisContracts.js").ArmyCompositionAnalysis & import("../../Contracts/AnalysisContracts.js").ProvinceCountTimelineAnalysis & import("../../Contracts/AnalysisContracts.js").MiliaryFactionStatistics & import("../../Contracts/ExtractionContracts.js").BidAnalysisData & import("../../Contracts/AnalysisContracts.js").CardChoiceAnalysisData>>;
export declare function storeData(data: AnalyzedData, override?: boolean): Promise<void>;
//# sourceMappingURL=LoadAndStoreData.d.ts.map