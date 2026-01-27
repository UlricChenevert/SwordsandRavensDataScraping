import { Factions } from "../../ScrapedData/GameTypes.js";
import { BattleAreaAnalyzer, BattleStrategyAnalyzer, ProvinceDistributionAnalyzer, ProvinceControlAnalyzer, ArmyCompositionAnalyzer, ProvinceCountTimelineAnalyzer, FactionStatsAnalyzer } from "../Contracts/AnalysisContracts.js";
import { ScrapedData } from "../Contracts/ExtractionContracts.js";
export declare const analyzePossibleCardChoice: (data: ScrapedData) => Record<Factions, import("../Contracts/AnalysisContracts.js").CardChoiceProbabilityBuckets>;
export declare const analyzeBattleAreas: BattleAreaAnalyzer;
export declare const analyzeBattleStrategies: BattleStrategyAnalyzer;
export declare const analyzeProvinceDistributions: ProvinceDistributionAnalyzer;
export declare const analyzeProvinceControl: ProvinceControlAnalyzer;
export declare const analyzeArmyComposition: ArmyCompositionAnalyzer;
export declare const analyzeProvinceCountTimeline: ProvinceCountTimelineAnalyzer;
export declare const analyzeFactionBattleStats: FactionStatsAnalyzer;
//# sourceMappingURL=MiltaryAnalysis.d.ts.map