import { CombatResultLog, ProvinceStats, ArmyComposition, FactionStats } from "../Contracts/ExtractionContracts";

export const analyzeBattleAreas = (combatLogs: CombatResultLog[]): Map<string, number> => {
  const commonBattleAreas = new Map<string, number>();
  combatLogs.forEach((combat) => {
    const region = combat.stats[0]?.region || "unknown";
    commonBattleAreas.set(region, (commonBattleAreas.get(region) || 0) + 1);
  });
  return commonBattleAreas;
};

export const analyzeBattleStrategies = (
  combatLogs: CombatResultLog[]
): Map<string, { aggressive: number; decisive: number; passive: number }> => {
  const battleStrategies = new Map<string, { aggressive: number; decisive: number; passive: number }>();
  combatLogs.forEach((combat) => {
    combat.stats.forEach((stat) => {
      const house = stat.house;
      if (!battleStrategies.has(house)) {
        battleStrategies.set(house, { aggressive: 0, decisive: 0, passive: 0 });
      }

      const strategy = battleStrategies.get(house)!;
      const strength = stat.total;
      const enemyStrength = combat.stats.find((s) => s.house !== house)?.total || 0;

      if (strength > enemyStrength * 1.5) {
        strategy.aggressive++;
      } else if (strength > enemyStrength) {
        strategy.decisive++;
      } else {
        strategy.passive++;
      }
    });
  });
  return battleStrategies;
};

export const analyzeProvinceDistributions = (combatLogs: CombatResultLog[]): Map<string, ProvinceStats> => {
  const provinceDistributions = new Map<string, ProvinceStats>();
  combatLogs.forEach((combat) => {
    const province = combat.stats[0]?.region || "unknown";
    if (!provinceDistributions.has(province)) {
      provinceDistributions.set(province, {
        contestedCount: 0,
        winRate: new Map(),
        criticality: "low",
        avgLossImpact: 0,
        controllingFactions: new Map(),
      });
    }

    const stats = provinceDistributions.get(province)!;
    stats.contestedCount++;

    combat.stats.forEach((stat) => {
      const faction = stat.house;
      const winRate = stat.isWinner ? 1 : 0;
      stats.winRate.set(faction, (stats.winRate.get(faction) || 0) + winRate);
    });
  });

  // Calculate criticality based on frequency and win impact
  provinceDistributions.forEach((stats, province) => {
    if (stats.contestedCount > 10) {
      stats.criticality = "high";
    } else if (stats.contestedCount > 5) {
      stats.criticality = "medium";
    }

    // Calculate average loss impact
    const losses = combatLogs.filter((c) => c.stats[0]?.region === province && c.stats.some((s) => !s.isWinner));
    stats.avgLossImpact =
      losses.length > 0
        ? losses.reduce((sum, combat) => {
            const loser = combat.stats.find((s) => !s.isWinner);
            return sum + (loser?.army || 0);
          }, 0) / losses.length
        : 0;
  });

  return provinceDistributions;
};

export const analyzeProvinceControl = (combatLogs: CombatResultLog[]): Map<string, Map<string, number>> => {
  const provinceControl = new Map<string, Map<string, number>>();
  combatLogs.forEach((combat) => {
    const province = combat.stats[0]?.region || "unknown";
    if (!provinceControl.has(province)) {
      provinceControl.set(province, new Map());
    }

    const factionMap = provinceControl.get(province)!;
    const winner = combat.stats.find((s) => s.isWinner);
    if (winner) {
      factionMap.set(winner.house, (factionMap.get(winner.house) || 0) + 1);
    }
  });
  return provinceControl;
};

export const analyzeArmyComposition = (combatLogs: CombatResultLog[]): ArmyComposition[] => {
  const armyCompositionTimeline: ArmyComposition[] = [];
  combatLogs.forEach((combat, index) => {
    combat.stats.forEach((stat) => {
      armyCompositionTimeline.push({
        timestamp: index,
        faction: stat.house,
        units: stat.armyUnits || [],
        totalStrength: stat.army,
      });
    });
  });
  return armyCompositionTimeline;
};

export const analyzeProvinceCountTimeline = (combatLogs: CombatResultLog[]): Array<{ timestamp: number; faction: string; count: number }> => {
  const provinceCountTimeline: Array<{ timestamp: number; faction: string; count: number }> = [];
  const factionProvinceCount = new Map<string, number>();

  combatLogs.forEach((combat, index) => {
    const winner = combat.stats.find((s) => s.isWinner);
    if (winner) {
      factionProvinceCount.set(winner.house, (factionProvinceCount.get(winner.house) || 0) + 1);
      provinceCountTimeline.push({
        timestamp: index,
        faction: winner.house,
        count: factionProvinceCount.get(winner.house) || 0,
      });
    }
  });
  return provinceCountTimeline;
};

export const analyzeFactionStats = (combatLogs: CombatResultLog[]): Map<string, FactionStats> => {
  const factionStats = new Map<string, FactionStats>();
  combatLogs.forEach((combat) => {
    combat.stats.forEach((stat) => {
      const faction = stat.house;
      if (!factionStats.has(faction)) {
        factionStats.set(faction, {
          wins: 0,
          losses: 0,
          totalBattles: 0,
          winRate: 0,
          avgArmySize: 0,
          avgEnemyArmy: 0,
          commonHouseCards: new Map(),
          regionVictories: new Map(),
          regionLosses: new Map(),
        });
      }

      const stats = factionStats.get(faction)!;
      stats.totalBattles++;

      if (stat.isWinner) {
        stats.wins++;
        stats.regionVictories.set(stat.region, (stats.regionVictories.get(stat.region) || 0) + 1);
      } else {
        stats.losses++;
        stats.regionLosses.set(stat.region, (stats.regionLosses.get(stat.region) || 0) + 1);
      }

      const enemyArmy = combat.stats.find((s) => s.house !== faction)?.army || 0;
      stats.avgArmySize = (stats.avgArmySize * (stats.totalBattles - 1) + stat.army) / stats.totalBattles;
      stats.avgEnemyArmy = (stats.avgEnemyArmy * (stats.totalBattles - 1) + enemyArmy) / stats.totalBattles;

      if (stat.houseCard) {
        stats.commonHouseCards.set(stat.houseCard, (stats.commonHouseCards.get(stat.houseCard) || 0) + 1);
      }
    });
  });

  // Calculate win rates
  factionStats.forEach((stats) => {
    stats.winRate = stats.totalBattles > 0 ? stats.wins / stats.totalBattles : 0;
  });

  return factionStats;
};