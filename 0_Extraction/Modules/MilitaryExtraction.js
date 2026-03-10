// ===== DATA EXTRACTION FUNCTIONS =====
export const extractMilitaryData = (logData, gameState) => {
    const combatLogs = [];
    // Process CombatResult logs
    logData.forEach((log, index) => {
        if (log.type !== "combat-result")
            return;
        const combatResult = log;
        let AttackLog;
        let SupportDeclaredLogs = [];
        let SupportRefusedLogs = [];
        // Progression:
        // Attack initialed
        // Support declared
        // Cards Chosen
        // Battle Commences
        // Post battle decisions
        // Battle finishes <== current log
        let RoundBeginningTerminateInfiniteLoopCondition = false;
        let currentLogIsAttackLog = false;
        let logCorrelationIndex = index;
        while (!currentLogIsAttackLog && !RoundBeginningTerminateInfiniteLoopCondition) {
            logCorrelationIndex--;
            const correlatedLog = logData[logCorrelationIndex]; // we already check for "turn-begin"
            if (correlatedLog.type == "support-declared") {
                SupportDeclaredLogs.push(correlatedLog);
            }
            else if (correlatedLog.type == "support-refused") {
                SupportRefusedLogs.push(correlatedLog);
            }
            RoundBeginningTerminateInfiniteLoopCondition = correlatedLog.type == "turn-begin";
            currentLogIsAttackLog = correlatedLog.type == "attack";
        }
        if (RoundBeginningTerminateInfiniteLoopCondition) {
            console.error("Infinite Log in extract military data");
            return;
        }
        AttackLog = logData[logCorrelationIndex]; // I am too tired to figure out why the index isn't on the money
        const winnerStats = combatResult.stats.find((s) => s.isWinner);
        const loserStats = combatResult.stats.find((s) => !s.isWinner);
        if (winnerStats === undefined || loserStats === undefined)
            throw "winnerStats or loserStats is undefined???";
        const winnerSupport = SupportDeclaredLogs
            .filter((support) => support.supported == winnerStats.house)
            .map(support => support.supporter);
        const loserSupport = SupportDeclaredLogs
            .filter((support) => support.supported == loserStats.house)
            .map(support => support.supporter);
        const winnerRefusedSupport = SupportRefusedLogs
            .filter((support) => support.house == winnerStats.house)
            .length > 0;
        const loserRefusedSupport = SupportRefusedLogs
            .filter((support) => support.house == loserStats.house)
            .length > 0;
        const battleData = {
            Attacker: AttackLog.attacker,
            AttackerRegion: AttackLog.attackingRegion,
            Defender: AttackLog.attacked ?? "unknown",
            AttackedRegion: AttackLog.attackedRegion,
        };
        const winnerData = {
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
            currentGameStateReferenceIndex: index,
        };
        const loserData = {
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
            currentGameStateReferenceIndex: index,
        };
        combatLogs.push({
            BattleData: battleData,
            WinnerData: winnerData,
            LoserData: loserData,
            CorrespondingTurnIndex: index
        });
    });
    return { combatLogs };
};
