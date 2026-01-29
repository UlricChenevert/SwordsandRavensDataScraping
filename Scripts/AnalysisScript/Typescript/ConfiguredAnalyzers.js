import { GameDataAnalyzer } from "./AnalysisEngine.js";
import { analyzeFactionBattleStats, FactionBattleStatsTrialCombination } from "../../Analysis Modules/Miltary/FactionBattleStats.js";
import { analyzeBidDistributions } from "../../Analysis Modules/AnalyzeBids.js";
import { analyzePossibleCardChoice } from "../../Analysis Modules/Miltary/CardChoiceAnalysis.js";
import { BidTrialCombination } from "../../Analysis Modules/BidTrialCombination.js";
import { CardChoiceTrialCombination } from "../../Analysis Modules/Miltary/CardChoiceTrialCombination.js";
export const FactionBattleAnalyzer = new GameDataAnalyzer(analyzeFactionBattleStats, FactionBattleStatsTrialCombination);
export const BidAnalyzer = new GameDataAnalyzer(analyzeBidDistributions, BidTrialCombination);
export const CardChoiceAnalyzer = new GameDataAnalyzer(analyzePossibleCardChoice, CardChoiceTrialCombination);
//# sourceMappingURL=ConfiguredAnalyzers.js.map