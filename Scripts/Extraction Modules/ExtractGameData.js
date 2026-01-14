import { extractBidData } from "./BiddingExtraction.js";
import { extractMilitaryData } from "./MilitaryExtraction.js";
import { extractPlayerData } from "./PlayerExtraction.js";
export const extractGameData = (GameClient) => {
    const GameState = GameClient.entireGame.childGameState;
    const GameLogs = GameState.gameLogManager.logs;
    const TurnMapping = extractGameTurnData(GameLogs);
    const extractedData = {};
    Object.assign(extractedData, extractLogData(GameLogs, [extractBidData, extractMilitaryData], TurnMapping));
    Object.assign(extractedData, extractMiscData(GameClient, [extractPlayerData]));
    return extractedData;
};
export const extractLogData = (logs, Extractors, gameRoundToLogIndex) => {
    const logData = logs.map((log) => log.data);
    const finalObject = {};
    Extractors.forEach((trackerLambda) => {
        Object.assign(finalObject, trackerLambda(logData, gameRoundToLogIndex));
    });
    return finalObject;
};
export const extractGameTurnData = (logs) => {
    const final = [];
    logs.forEach((log, index) => {
        if (log.data.type != "turn-begin")
            return;
        let orderRevealedIndex = index;
        while (logs[orderRevealedIndex].data.type != "orders-revealed")
            orderRevealedIndex++;
        const orderRevealed = logs[orderRevealedIndex].data;
        const ironTrack = (orderRevealed.gameSnapshot?.ironThroneTrack) ? orderRevealed.gameSnapshot?.ironThroneTrack : [];
        const fiefdomTrack = (orderRevealed.gameSnapshot?.fiefdomsTrack) ? orderRevealed.gameSnapshot?.fiefdomsTrack : [];
        const kingsCourtTrack = (orderRevealed.gameSnapshot?.kingsCourtTrack) ? orderRevealed.gameSnapshot?.kingsCourtTrack : [];
        const victoryTrack = (orderRevealed.gameSnapshot?.housesOnVictoryTrack) ? orderRevealed.gameSnapshot?.housesOnVictoryTrack : [];
        final.push({
            index: index,
            round: log.data.turn,
            wildlingStrength: orderRevealed.gameSnapshot?.wildlingStrength,
            dragonStrength: orderRevealed.gameSnapshot?.dragonStrength,
            ironThroneTrack: ironTrack,
            fiefdomsTrack: fiefdomTrack,
            kingsCourtTrack: kingsCourtTrack,
            housesOnVictoryTrack: victoryTrack,
            vsbUsed: orderRevealed.gameSnapshot?.vsbUsed,
            ironBank: orderRevealed.gameSnapshot?.ironBank,
        });
    });
    return final;
};
export const extractMiscData = (GameClient, Extractors) => {
    const finalObject = {};
    Extractors.forEach((extractionLambda) => {
        Object.assign(finalObject, extractionLambda(GameClient));
    });
    return finalObject;
};
//# sourceMappingURL=ExtractGameData.js.map