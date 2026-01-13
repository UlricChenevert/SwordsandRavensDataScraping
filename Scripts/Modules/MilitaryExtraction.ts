import { GameLogData, CombatResult, CombatStats, Attack, Factions } from "../../ScrapedData/GameTypes";
import { ArmyComposition, AttackLog, BattleStats, CombatResultLog, ExtractedMilitaryData, FactionStats, IGameLogDataExtractor, ProvinceStats } from "../Contracts/ExtractionContracts";

// ===== DATA EXTRACTION FUNCTIONS =====

export const extractBattleStats = (combatLogs: CombatResultLog[]): BattleStats[] => {
  return combatLogs.map((combat, index) => {
    const winner = combat.stats.find((s) => s.isWinner);
    const loser = combat.stats.find((s) => !s.isWinner);

    return {
      region: winner?.region || "unknown",
      winner: winner?.house || "unknown",
      loser: loser?.house || "unknown",
      winnerArmy: winner?.army || 0,
      loserArmy: loser?.army || 0,
      winnerHouseCard: winner?.houseCard || null,
      loserHouseCard: loser?.houseCard || null,
      support: (winner?.support || 0) + (loser?.support || 0),
      location: winner?.region || "unknown",
      timestamp: index,
    };
  });
};

export const extractMilitaryData : IGameLogDataExtractor<ExtractedMilitaryData> = (logData: GameLogData[]) => {
  const combatLogs = logData.filter((log): log is CombatResultLog => log.type === "combat-result");
  const attackLogs = logData.filter((log): log is AttackLog => log.type === "attack");
  const commonBattleStats = extractBattleStats(combatLogs);

  return {
    commonBattleStats,
    combatLogs,
    attackLogs,
  };
};
