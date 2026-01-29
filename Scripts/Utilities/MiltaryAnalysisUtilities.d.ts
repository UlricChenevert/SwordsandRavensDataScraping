import { Factions, GameLocation, HouseCard } from "../../ScrapedData/GameTypes.js";
import { CardChoiceProbabilityBuckets, ProbablyDistribution, SumDistribution, WorkingCardTotalDistributions } from "../Contracts/AnalysisContracts.js";
import { BattleParticipantLog, CombatLog, ScrapedData } from "../Contracts/ExtractionContracts.js";
export declare const extractCombatLogs: (data: ScrapedData) => CombatLog[];
export declare const workingCardTotalDistributionFactory: () => Record<Factions, WorkingCardTotalDistributions>;
export declare const emptyAverageCardDistributionFactory: () => Record<Factions, CardChoiceProbabilityBuckets>;
export declare const incrementCardDistribution: (record: SumDistribution, houseCard: HouseCard) => void;
export declare const combineCardDistributions: (newDistribution: ProbablyDistribution | undefined, targetDistribution: ProbablyDistribution | undefined) => void;
export declare const combineCardDistributionForMap: <T>(oldDistributionMap: Map<T, ProbablyDistribution>, key: T, newProbabilityDistribution: ProbablyDistribution) => void;
export declare const incrementCardDistributionForMap: <T>(map: Map<T, SumDistribution>, key: T, houseCard: HouseCard) => void;
export declare const incrementCardDistributionFromBattleParticipant: (location: GameLocation, mainParticipant: BattleParticipantLog, secondaryParticipant: BattleParticipantLog, workingCardDistributions: Record<Factions, WorkingCardTotalDistributions>) => void;
export declare const averageAllDistributions: (workingCardDistributions: WorkingCardTotalDistributions, targetCardDistribution: CardChoiceProbabilityBuckets) => CardChoiceProbabilityBuckets;
//# sourceMappingURL=MiltaryAnalysisUtilities.d.ts.map