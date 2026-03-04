// Coin / Power token, land size,

import { EntireGameSnapshot, Factions, GameLogData, OrdersRevealed, SnapshotMigrator, UnitState } from "../Contracts/GameTypes.js";
import { IGameLogDataExtractor } from "../../Contracts/ExtractionContracts.js"
import { findCorrespondingRound } from "./GameRoundExtraction.js";
import { ExtractedRoundData, ExtractedGameStateData } from "../Contracts/Contracts.js";
import { ExtractedRoundDataFactory } from "../Utilities/ClassFactories.js";
import { SnapshotMigratorConstructor, EntireGameSnapshotConstructor } from "../Utilities/GrabClassConstructors.js";
import { changeSnapshotWithNewLog } from "../Utilities/ReplayManagerReimplementation.js";

export const extractTurnStateData : IGameLogDataExtractor<ExtractedGameStateData> = (logData: GameLogData[], gameRoundMapping, gameState) => {
    const cleanData : ExtractedGameStateData = {Rounds: []}

    let migrator : SnapshotMigrator = new SnapshotMigratorConstructor(gameState);
    
    let startingIndex = 0;
    const setupLog = logData.find((l, index) => {startingIndex = index; return l.type === "orders-revealed"}) as OrdersRevealed;
    if (!setupLog) throw "No setup log found to initialize snapshot";

    let currentSnapshot : EntireGameSnapshot = new EntireGameSnapshotConstructor({
    worldSnapshot: setupLog.worldState,
    gameSnapshot: setupLog.gameSnapshot,
    }, gameState);
    
    logData.forEach((log, index)=>{
        // Cannot get data before the first order revealed, because that can throw off migrator state
        if (index < startingIndex) return 
        if (log.type === "orders-revealed") {
                migrator = new SnapshotMigratorConstructor(gameState);
        }        
        currentSnapshot = changeSnapshotWithNewLog(migrator, currentSnapshot, log, index, gameState)

        currentSnapshot.calculateControllersPerRegion();
        if (currentSnapshot.gameSnapshot) {
            // Refresh the victory track data so house stats are current
            currentSnapshot.gameSnapshot.housesOnVictoryTrack = currentSnapshot.getVictoryTrack();
        }
        
        const extractedRoundData : ExtractedRoundData = ExtractedRoundDataFactory()

        extractedRoundData.Round = findCorrespondingRound(index, gameRoundMapping).round
        extractedRoundData.LogIndex = index
        
        if (currentSnapshot.gameSnapshot) {
            currentSnapshot.gameSnapshot.housesOnVictoryTrack.forEach((house)=>{
                const extractedHouseRef = extractedRoundData.HouseSnapshotData[house.id]
                
                extractedHouseRef.CastleCount = house.victoryPoints
                extractedHouseRef.LandAreaCount = house.landAreaCount
                extractedHouseRef.PowerTokens = house.powerTokens
                extractedHouseRef.SupplyTier = house.supply
            })
        }
        
        currentSnapshot.worldSnapshot.forEach((region)=>{
            
            if (region.order) 
                extractedRoundData.OrderTokenChoices[region.id] = region.order.type
            
            let controller = currentSnapshot.getController(region.id);
            if (!controller) return
            
            extractedRoundData.HouseSnapshotData[controller.id].LandAreas.push(region.id)

            if (!region.units) return

            extractedRoundData.UnitLocationSnapshotData[region.id] = region.units
        })

        cleanData.Rounds.push(extractedRoundData)
    })

    return cleanData
}