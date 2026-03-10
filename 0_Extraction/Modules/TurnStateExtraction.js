// Coin / Power token, land size,
import { ExtractedRoundDataFactory } from "../Utilities/ClassFactories.js";
import { SnapshotMigratorConstructor, EntireGameSnapshotConstructor } from "../Utilities/GrabClassConstructors.js";
import { changeSnapshotWithNewLog } from "../Utilities/ReplayManagerReimplementation.js";
import { InfluenceTracks } from "../Contracts/GameConstants.js";
export const extractTurnStateData = (logData, gameState) => {
    const cleanData = { Rounds: [], InErrorGame: false };
    let inErroneousRound = false;
    let migrator = new SnapshotMigratorConstructor(gameState);
    let startingIndex = 0;
    const setupLog = logData.find((l, index) => { startingIndex = index; return l.type === "orders-revealed"; });
    if (!setupLog)
        throw "No setup log found to initialize snapshot";
    let currentSnapshot = new EntireGameSnapshotConstructor({
        worldSnapshot: setupLog.worldState,
        gameSnapshot: setupLog.gameSnapshot,
    }, gameState);
    logData.forEach((log, index) => {
        // Cannot get data before the first order revealed, because that can throw off migrator state
        if (index < startingIndex)
            return;
        if (log.type === "orders-revealed") {
            migrator = new SnapshotMigratorConstructor(gameState);
            inErroneousRound = false;
        }
        if (inErroneousRound)
            return; // Reset the round state
        try {
            currentSnapshot = changeSnapshotWithNewLog(migrator, currentSnapshot, log, index, gameState);
        }
        catch {
            inErroneousRound = true;
            cleanData.InErrorGame = true;
            return;
        }
        currentSnapshot.calculateControllersPerRegion();
        if (currentSnapshot.gameSnapshot) {
            // Refresh the victory track data so house stats are current
            currentSnapshot.gameSnapshot.housesOnVictoryTrack = currentSnapshot.getVictoryTrack();
        }
        const extractedRoundData = ExtractedRoundDataFactory();
        extractedRoundData.LogIndex = index;
        if (currentSnapshot.gameSnapshot) {
            currentSnapshot.gameSnapshot.housesOnVictoryTrack.forEach((house) => {
                const extractedHouseRef = extractedRoundData.HouseSnapshotData[house.id];
                extractedHouseRef.RoundEndCastleCount = house.victoryPoints;
                extractedHouseRef.LandAreaCount = house.landAreaCount;
                extractedHouseRef.PowerTokens = house.powerTokens;
                extractedHouseRef.SupplyTier = house.supply;
            });
            extractedRoundData.IronThroneTrack = currentSnapshot.getInfluenceTrack(InfluenceTracks["Iron Throne"]);
            extractedRoundData.FiefdomTrack = currentSnapshot.getInfluenceTrack(InfluenceTracks["Fiefdom"]);
            extractedRoundData.KingsCourtThroneTrack = currentSnapshot.getInfluenceTrack(InfluenceTracks["King's Court"]);
            extractedRoundData.Round = currentSnapshot.gameSnapshot.round;
        }
        currentSnapshot.worldSnapshot.forEach((region) => {
            if (region.order)
                extractedRoundData.OrderTokenChoices[region.id] = region.order.type;
            let controller = currentSnapshot.getController(region.id);
            if (!controller)
                return;
            extractedRoundData.HouseSnapshotData[controller.id].LandAreas.push(region.id);
            if (!region.units)
                return;
            extractedRoundData.UnitLocationSnapshotData[region.id] = region.units;
        });
        cleanData.Rounds.push(extractedRoundData);
    });
    if (cleanData.InErrorGame)
        alert("Snapshot Migrator failed at least once, please use data with caution!");
    return cleanData;
};
