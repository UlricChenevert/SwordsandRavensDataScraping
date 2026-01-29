import { extractCombatLogs } from "../../Utilities/MiltaryAnalysisUtilities.js";
export const analyzeBattleAreas = (data) => {
    const combatLogs = extractCombatLogs(data);
    const commonBattleAreas = new Map();
    combatLogs.forEach((combat) => {
        const region = combat.BattleData.AttackedRegion || "unknown";
        commonBattleAreas.set(region, (commonBattleAreas.get(region) || 0) + 1);
    });
    return { BattleAreas: commonBattleAreas };
};
export const analyzeBattleStrategies = (data) => {
    const combatLogs = extractCombatLogs(data);
    const battleStrategies = new Map();
    combatLogs.forEach((combat) => {
        // Initialize for both houses if needed
        [combat.WinnerData.House, combat.LoserData.House].forEach((house) => {
            if (!battleStrategies.has(house)) {
                battleStrategies.set(house, { aggressive: 0, decisive: 0, passive: 0 });
            }
        });
        const winnerStrategy = battleStrategies.get(combat.WinnerData.House);
        const loserStrategy = battleStrategies.get(combat.LoserData.House);
        const winnerStrength = combat.WinnerData.Total;
        const loserStrength = combat.LoserData.Total;
        // Categorize winner's strategy
        if (winnerStrength > loserStrength * 1.5) {
            winnerStrategy.aggressive++;
        }
        else if (winnerStrength > loserStrength) {
            winnerStrategy.decisive++;
        }
        else {
            winnerStrategy.passive++; // Won against superior odds
        }
        // Categorize loser's strategy
        if (loserStrength > winnerStrength * 1.5) {
            loserStrategy.aggressive++; // Lost despite superior odds
        }
        else if (loserStrength > winnerStrength) {
            loserStrategy.decisive++;
        }
        else {
            loserStrategy.passive++;
        }
    });
    return { BattleStrategies: battleStrategies };
};
export const analyzeProvinceDistributions = (data) => {
    const combatLogs = extractCombatLogs(data);
    const provinceDistributions = new Map();
    combatLogs.forEach((combat) => {
        const province = combat.BattleData.AttackedRegion || "unknown";
        if (!provinceDistributions.has(province)) {
            provinceDistributions.set(province, {
                contestedCount: 0,
                winRate: new Map(),
                criticality: "low",
                avgLossImpact: 0,
                controllingFactions: new Map(),
            });
        }
        const stats = provinceDistributions.get(province);
        stats.contestedCount++;
        // Record winner's win
        stats.winRate.set(combat.WinnerData.House, (stats.winRate.get(combat.WinnerData.House) || 0) + 1);
        // Record loser's losses
        stats.winRate.set(combat.LoserData.House, (stats.winRate.get(combat.LoserData.House) || 0) + 0);
        // Track controlling factions
        stats.controllingFactions.set(combat.WinnerData.House, (stats.controllingFactions.get(combat.WinnerData.House) || 0) + 1);
    });
    // Calculate criticality based on frequency and determine average loss impact
    provinceDistributions.forEach((stats, province) => {
        if (stats.contestedCount > 10) {
            stats.criticality = "high";
        }
        else if (stats.contestedCount > 5) {
            stats.criticality = "medium";
        }
        // Calculate average loss impact by analyzing loser armies
        const provinceCombats = combatLogs.filter((c) => c.BattleData.AttackedRegion === province);
        if (provinceCombats.length > 0) {
            const totalLosses = provinceCombats.reduce((sum, combat) => {
                return sum + combat.LoserData.ArmyStrength;
            }, 0);
            stats.avgLossImpact = totalLosses / provinceCombats.length;
        }
    });
    return { ProvinceDistributions: provinceDistributions };
};
export const analyzeProvinceControl = (data) => {
    const combatLogs = extractCombatLogs(data);
    const provinceControl = new Map();
    combatLogs.forEach((combat) => {
        const province = combat.BattleData.AttackedRegion || "unknown";
        if (!provinceControl.has(province)) {
            provinceControl.set(province, new Map());
        }
        const factionMap = provinceControl.get(province);
        const winner = combat.WinnerData.House;
        factionMap.set(winner, (factionMap.get(winner) || 0) + 1);
    });
    return { ProvinceControl: provinceControl };
};
export const analyzeArmyComposition = (data) => {
    const combatLogs = extractCombatLogs(data);
    const armyCompositionTimeline = [];
    combatLogs.forEach((combat, index) => {
        // Winner's composition
        armyCompositionTimeline.push({
            timestamp: index,
            faction: combat.WinnerData.House,
            units: combat.WinnerData.ArmyUnits,
            totalStrength: combat.WinnerData.ArmyStrength,
        });
        // Loser's composition
        armyCompositionTimeline.push({
            timestamp: index,
            faction: combat.LoserData.House,
            units: combat.LoserData.ArmyUnits,
            totalStrength: combat.LoserData.ArmyStrength,
        });
    });
    return { ArmyCompositionTimeline: armyCompositionTimeline };
};
export const analyzeProvinceCountTimeline = (data) => {
    const combatLogs = extractCombatLogs(data);
    const provinceCountTimeline = [];
    const factionProvinceCount = new Map();
    combatLogs.forEach((combat, index) => {
        const winner = combat.WinnerData.House;
        factionProvinceCount.set(winner, (factionProvinceCount.get(winner) || 0) + 1);
        provinceCountTimeline.push({
            timestamp: index,
            faction: winner,
            count: factionProvinceCount.get(winner) || 0,
        });
    });
    return { ProvinceCountTimeline: provinceCountTimeline };
};
//# sourceMappingURL=MiscMiltaryAnalysis.js.map