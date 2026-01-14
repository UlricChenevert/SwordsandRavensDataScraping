import { Factions } from "../../ScrapedData/GameTypes.js";
import { FactionStats } from "../Contracts/ExtractionContracts.js";
import { analyzeFactionBattleStats } from "../Analysis Modules/MiltaryAnalysis.js";
import { GameDataAnalyzer } from "./AnalysisEngine.js";

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
    
    // Update game winning faction based on final win rate
    workingStatistic.gameWinningFaction = workingStatistic.winRate > (newStatistic.winRate || 0);

    return workingStatistic
}

export const FactionBattleAnalyzer = new GameDataAnalyzer(analyzeFactionBattleStats, (trials)=>{
    const result: Record<Factions, FactionStats> = {
        baratheon: undefined,
        tyrell: undefined,
        lannister: undefined,
        arryn: undefined,
        greyjoy: undefined,
        targaryen: undefined,
        martell: undefined,
        stark: undefined
    };

    for (let i = 0; i < trials.length; i++) {
        const trial = trials[i].MiliaryFactionStatistics

        result.arryn = combineFactionStats(result.arryn, trial.arryn)
        result.tyrell = combineFactionStats(result.tyrell, trial.tyrell)
        result.lannister = combineFactionStats(result.lannister, trial.lannister)
        result.greyjoy = combineFactionStats(result.greyjoy, trial.greyjoy)
        result.targaryen = combineFactionStats(result.targaryen, trial.targaryen)
        result.martell = combineFactionStats(result.martell, trial.martell)
        result.baratheon = combineFactionStats(result.baratheon, trial.baratheon)
        result.stark = combineFactionStats(result.stark, trial.stark)
    }
    
    return {MiliaryFactionStatistics: result}
})

