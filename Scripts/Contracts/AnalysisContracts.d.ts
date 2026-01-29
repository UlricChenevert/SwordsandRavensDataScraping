import { Factions, GameLocation, HouseCard } from "../../ScrapedData/GameTypes.js";
import { AnalyzedKeys } from "./AnalysisConstants.ts";
import { FactionStats, ProvinceStats, ArmyComposition, ScrapedData, BidAnalysisData } from "./ExtractionContracts.js";

type IGameDataAnalyzer<ReturnedObject extends object> = (data : ScrapedData) => ReturnedObject

type ITrialCombination<ReturnedObject extends object> = (data : ReturnedObject[], combinedData : AnalyzedData) => void

// ===== BATTLE ANALYSIS =====
type SumDistribution = {SumDistribution : Map<HouseCard, number>, Total : number}

type ProbablyDistribution = {Probability : Map<HouseCard, number>, Total : number}

type WorkingCardTotalDistributions = {
  LocationDistributions: Record<GameLocation, SumDistribution>
  OppositeSideStrengthDistributions: Map<number, SumDistribution>
  NonCardStrengthDistributions: Map<number, SumDistribution>
}

type CardChoiceProbabilityBuckets = {
  LocationDistributions : Record<GameLocation, ProbablyDistribution>,
  OppositeSideStrengthDistributions : Map<number, ProbablyDistribution>,
  NonCardStrengthDistributions : Map<number, ProbablyDistribution>,
}

type BattleAreaAnalysis = {
  BattleAreas: Map<string, number>;
};

type BattleStrategyAnalysis = {
  BattleStrategies: Map<string, { aggressive: number; decisive: number; passive: number }>;
};

type ProvinceDistributionAnalysis = {
  ProvinceDistributions: Map<string, ProvinceStats>;
};

type ProvinceControlAnalysis = {
  ProvinceControl: Map<string, Map<string, number>>;
};

type ArmyCompositionAnalysis = {
  ArmyCompositionTimeline: ArmyComposition[];
};

type ProvinceCountTimelineAnalysis = {
  ProvinceCountTimeline: Array<{ timestamp: number; faction: string; count: number }>;
};

// ===== FACTION ANALYSIS =====

type MiliaryFactionStatistics = {
  [AnalyzedKeys.MiliaryFactionStatistics]: {
    [key in Factions]: FactionStats;
  };
};

// ===== ANALYZER EXPORTS =====

type BattleAreaAnalyzer = IGameDataAnalyzer<BattleAreaAnalysis>;
type BattleStrategyAnalyzer = IGameDataAnalyzer<BattleStrategyAnalysis>;
type ProvinceDistributionAnalyzer = IGameDataAnalyzer<ProvinceDistributionAnalysis>;
type ProvinceControlAnalyzer = IGameDataAnalyzer<ProvinceControlAnalysis>;
type ArmyCompositionAnalyzer = IGameDataAnalyzer<ArmyCompositionAnalysis>;
type ProvinceCountTimelineAnalyzer = IGameDataAnalyzer<ProvinceCountTimelineAnalysis>;
type FactionStatsAnalyzer = IGameDataAnalyzer<MiliaryFactionStatistics>;

type analysisTypes = 
    BattleAreaAnalysis 
    | BattleStrategyAnalysis 
    | ProvinceDistributionAnalysis
    | ProvinceControlAnalysis
    | ArmyCompositionAnalysis
    | ProvinceCountTimelineAnalysis
    | MiliaryFactionStatistics
    | BidAnalysisData
    | CardChoiceAnalysisData

type CardChoiceAnalysisData = {[AnalyzedKeys.CardChoices]: Record<Factions, CardChoiceProbabilityBuckets>}

type AnalyzedData = Partial<BattleAreaAnalysis 
    & BattleStrategyAnalysis 
    & ProvinceDistributionAnalysis
    & ProvinceControlAnalysis
    & ArmyCompositionAnalysis
    & ProvinceCountTimelineAnalysis
    & MiliaryFactionStatistics
    & BidAnalysisData
    & CardChoiceAnalysisData>