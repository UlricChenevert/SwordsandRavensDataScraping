import { Factions } from "../../../ScrapedData/GameTypes.js";
import { AnalyzedKeys } from "../../Contracts/AnalysisConstants.js";
import { FactionStatsAnalyzer, MiliaryFactionStatistics, ITrialCombination, AnalyzedData } from "../../Contracts/AnalysisContracts.js";
import { ScrapedData, FactionStats } from "../../Contracts/ExtractionContracts.js";
import { extractCombatLogs } from "../../Utilities/MiltaryAnalysisUtilities.js";

export const analyzeFactionBattleStats: FactionStatsAnalyzer = (data: ScrapedData): MiliaryFactionStatistics => {
  const combatLogs = extractCombatLogs(data);
  const factionStats = new Map<Factions, FactionStats>();
  
  // Initialize all possible factions
  const allFactions: Factions[] = ["baratheon", "tyrell", "lannister", "arryn", "greyjoy", "targaryen", "martell", "stark"];
  allFactions.forEach((faction) => {
    factionStats.set(faction, {
      wins: 0,
      losses: 0,
      totalBattles: 0,
      winRate: 0,
      avgArmySize: 0,
      avgEnemyArmy: 0,
      winningHouseCards: new Map(),
      regionVictories: new Map(),
      regionLosses: new Map(),
      winRateOverTime: [],
    });
  });

  combatLogs.forEach((combat) => {
    const winner = combat.WinnerData.House;
    const loser = combat.LoserData.House;
    const round = combat.round;

    // Update winner stats
    const winnerStats = factionStats.get(winner)!;
    winnerStats.totalBattles++;
    winnerStats.wins++;
    winnerStats.regionVictories.set(
      combat.BattleData.AttackedRegion,
      (winnerStats.regionVictories.get(combat.BattleData.AttackedRegion) || 0) + 1
    );

    // Track army strength
    winnerStats.avgArmySize = 
      (winnerStats.avgArmySize * (winnerStats.totalBattles - 1) + combat.WinnerData.Total) / winnerStats.totalBattles;
    winnerStats.avgEnemyArmy = 
      (winnerStats.avgEnemyArmy * (winnerStats.totalBattles - 1) + combat.LoserData.Total) / winnerStats.totalBattles;

    // Track house cards
    if (combat.WinnerData.HouseCard) {
      winnerStats.winningHouseCards.set(
        combat.WinnerData.HouseCard,
        (winnerStats.winningHouseCards.get(combat.WinnerData.HouseCard) || 0) + 1
      );
    }

    // Update loser stats
    const loserStats = factionStats.get(loser)!;
    loserStats.totalBattles++;
    loserStats.losses++;
    loserStats.regionLosses.set(
      combat.BattleData.AttackedRegion,
      (loserStats.regionLosses.get(combat.BattleData.AttackedRegion) || 0) + 1
    );

    // Track loser's army strength
    loserStats.avgArmySize = 
      (loserStats.avgArmySize * (loserStats.totalBattles - 1) + combat.LoserData.Total) / loserStats.totalBattles;
    loserStats.avgEnemyArmy = 
      (loserStats.avgEnemyArmy * (loserStats.totalBattles - 1) + combat.WinnerData.Total) / loserStats.totalBattles;

    // Track round-based win rate over time
    winnerStats.winRateOverTime.push({
      timestamp: round,
      winRate: 1, // This battle was a win
    });
    loserStats.winRateOverTime.push({
      timestamp: round,
      winRate: 0, // This battle was a loss
    });
  });

  // Convert to proper return type
  const result: Record<Factions, FactionStats> = {
    baratheon: factionStats.get("baratheon")!,
    tyrell: factionStats.get("tyrell")!,
    lannister: factionStats.get("lannister")!,
    arryn: factionStats.get("arryn")!,
    greyjoy: factionStats.get("greyjoy")!,
    targaryen: factionStats.get("targaryen")!,
    martell: factionStats.get("martell")!,
    stark: factionStats.get("stark")!,
  };

  return { [AnalyzedKeys.MiliaryFactionStatistics]: result };
};

export const FactionBattleStatsTrialCombination : ITrialCombination<MiliaryFactionStatistics> = (trials, combinedData: AnalyzedData)=>{
  if (combinedData[AnalyzedKeys.MiliaryFactionStatistics] === undefined) 
    combinedData[AnalyzedKeys.MiliaryFactionStatistics] = {
      baratheon: undefined,
      tyrell: undefined,
      lannister: undefined,
      arryn: undefined,
      greyjoy: undefined,
      targaryen: undefined,
      martell: undefined,
      stark: undefined
    };
  
  const result = combinedData[AnalyzedKeys.MiliaryFactionStatistics]

  for (let i = 0; i < trials.length; i++) {
      const trial = trials[i][AnalyzedKeys.MiliaryFactionStatistics]

      result.arryn = combineFactionStats(result.arryn, trial.arryn)
      result.tyrell = combineFactionStats(result.tyrell, trial.tyrell)
      result.lannister = combineFactionStats(result.lannister, trial.lannister)
      result.greyjoy = combineFactionStats(result.greyjoy, trial.greyjoy)
      result.targaryen = combineFactionStats(result.targaryen, trial.targaryen)
      result.martell = combineFactionStats(result.martell, trial.martell)
      result.baratheon = combineFactionStats(result.baratheon, trial.baratheon)
      result.stark = combineFactionStats(result.stark, trial.stark)
  }
  
  return {[AnalyzedKeys.MiliaryFactionStatistics]: result}
}

const combineFactionStats = (workingStatistic? : FactionStats, newStatistic? : FactionStats)=>{
    if (newStatistic === undefined) return workingStatistic // Nothing to combine
    
    if (workingStatistic === undefined) {
        return  newStatistic
    }
    
    workingStatistic.wins += newStatistic.wins;
    workingStatistic.losses += newStatistic.losses;
    workingStatistic.totalBattles += newStatistic.totalBattles;
    workingStatistic.winRate = workingStatistic.wins / workingStatistic.totalBattles;
    workingStatistic.avgArmySize = (workingStatistic.avgArmySize + newStatistic.avgArmySize) / 2;
    workingStatistic.avgEnemyArmy = (workingStatistic.avgEnemyArmy + newStatistic.avgEnemyArmy) / 2;
    
    // Combine house card wins
    newStatistic.winningHouseCards.forEach((count, card) => {
        const existing = workingStatistic.winningHouseCards.get(card) ?? 0;
        workingStatistic.winningHouseCards.set(card, existing + count);
    });
    
    // Combine region victories
    newStatistic.regionVictories.forEach((count, region) => {
        const existing = workingStatistic.regionVictories.get(region) ?? 0;
        workingStatistic.regionVictories.set(region, existing + count);
    });
    
    // Combine region losses
    newStatistic.regionLosses.forEach((count, region) => {
        const existing = workingStatistic.regionLosses.get(region) ?? 0;
        workingStatistic.regionLosses.set(region, existing + count);
    });

    // Combine win rate over time
    workingStatistic.winRateOverTime.push(...newStatistic.winRateOverTime);

    return workingStatistic
}