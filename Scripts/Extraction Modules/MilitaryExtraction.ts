import { HouseCardState } from "../../ScrapedData/GameConstants.js";
import { Attack, Factions, GameLogData, House, SupportDeclared, SupportRefused } from "../../ScrapedData/GameTypes.js";
import { AttackLog, BattleStats, CombatLog, BattleLog, BattleParticipantLog, ExtractedMilitaryData, IGameLogDataExtractor } from "../Contracts/ExtractionContracts.js";
import { findCorrespondingRound } from "../Utilities/GameRoundUtility.js";

// ===== DATA EXTRACTION FUNCTIONS =====

export const extractMilitaryData : IGameLogDataExtractor<ExtractedMilitaryData> = (logData: GameLogData[], gameRoundMapping) => {
  const combatLogs: CombatLog[] = [];

  // Process CombatResult logs
  logData.forEach((log, index) => {
    if (log.type !== "combat-result") return 
    const combatResult = log
    const round = findCorrespondingRound(index, gameRoundMapping);

    let AttackLog: Attack;
    let SupportDeclaredLogs: SupportDeclared[] = [];
    let SupportRefusedLogs: SupportRefused[] = [];

    // Progression:

    // Attack initialed

    // Support declared

    // Cards Chosen

    // Battle Commences

    // Post battle decisions

    // Battle finishes <== current log

    let RoundBeginningTerminateInfiniteLoopCondition = false;
    let currentLogIsAttackLog = false
    let logCorrelationIndex = index

    while (!currentLogIsAttackLog && !RoundBeginningTerminateInfiniteLoopCondition) {
      logCorrelationIndex--;
      
      const correlatedLog = logData[logCorrelationIndex]

      if (correlatedLog.type == "support-declared") {
        SupportDeclaredLogs.push(correlatedLog)
      }
      else if (correlatedLog.type == "support-refused") {
        SupportRefusedLogs.push(correlatedLog)
      }

      RoundBeginningTerminateInfiniteLoopCondition = correlatedLog.type == "turn-begin"
      currentLogIsAttackLog = correlatedLog.type == "attack"
    }

    if (RoundBeginningTerminateInfiniteLoopCondition) {console.error("Infinite Log in extract military data"); return}
    
    AttackLog = logData[logCorrelationIndex] as AttackLog // I am too tired to figure out why the index isn't on the money

    const winnerStats = combatResult.stats.find((s: any) => s.isWinner);
    const loserStats = combatResult.stats.find((s: any) => !s.isWinner);

    const winnerSupport = SupportDeclaredLogs
      .filter((support)=>support.supported==winnerStats.house)
      .map(support=>support.supporter)

    const loserSupport = SupportDeclaredLogs
      .filter((support)=>support.supported==loserStats.house)
      .map(support=>support.supporter)

    const winnerRefusedSupport = SupportRefusedLogs
      .filter((support)=>support.house==winnerStats.house)
      .length > 0

    const loserRefusedSupport = SupportRefusedLogs
      .filter((support)=>support.house==loserStats.house)
      .length > 0

    const winnerHouseCards = round.housesOnVictoryTrack
      .find((house)=>house.id==AttackLog.attacker)
      .houseCards
        .filter(x=>x.state==HouseCardState.AVAILABLE)
        .map(x=>x.id)

    const loserHouseCards = round.housesOnVictoryTrack
      .find((house)=>house.id==AttackLog.attacked)
      .houseCards
        .filter(x=>x.state==HouseCardState.AVAILABLE)
        .map(x=>x.id)

    // if (!winnerStats || !loserStats) continue;
    
    const battleData: BattleLog = {
      Attacker: AttackLog.attacker,
      AttackerRegion: AttackLog.attackingRegion,
      Defender: AttackLog.attacked,
      AttackedRegion: AttackLog.attackedRegion,
    };
    
    const winnerData: BattleParticipantLog = {
      House: winnerStats.house,
      OrderType: AttackLog.orderType,
      OrderBonus: winnerStats.orderBonus,
      ArmyStrength: winnerStats.army,
      ArmyUnits: winnerStats.armyUnits,
      WoundedUnits: winnerStats.woundedUnits,
      SupportStrength: winnerStats.support,
      SupportingFactions: winnerSupport, // Could be extracted from support logs if available
      RefusedSupport: winnerRefusedSupport,
      GarrisonStrength: winnerStats.garrison,
      HouseCard: winnerStats.houseCard,
      HouseCardStrength: winnerStats.houseCardStrength,
      ValyrianSteelBlade: winnerStats.valyrianSteelBlade,
      TidesOfBattleCard: winnerStats.tidesOfBattleCard,
      Total: winnerStats.total,
      HouseCardSelection: winnerHouseCards,
      FiefdomTrackPosition: round.fiefdomsTrack.findIndex((x)=>x==AttackLog.attacker)
    };
    
    const loserData: BattleParticipantLog = {
      House: loserStats.house,
      OrderType: undefined,
      OrderBonus: loserStats.orderBonus,
      ArmyStrength: loserStats.army,
      ArmyUnits: loserStats.armyUnits || [],
      WoundedUnits: loserStats.woundedUnits || [],
      SupportStrength: loserStats.support,
      SupportingFactions: loserSupport,
      RefusedSupport: loserRefusedSupport,
      GarrisonStrength: loserStats.garrison,
      HouseCard: loserStats.houseCard,
      HouseCardStrength: loserStats.houseCardStrength,
      ValyrianSteelBlade: loserStats.valyrianSteelBlade,
      TidesOfBattleCard: loserStats.tidesOfBattleCard,
      Total: loserStats.total,
      HouseCardSelection: loserHouseCards,
      FiefdomTrackPosition: round.fiefdomsTrack.findIndex((x)=>x==AttackLog.attacked)
    };
    
    combatLogs.push({
      BattleData: battleData,
      WinnerData: winnerData,
      LoserData: loserData,
      round: round.round,
    });
    
  });

  return { combatLogs };
};
