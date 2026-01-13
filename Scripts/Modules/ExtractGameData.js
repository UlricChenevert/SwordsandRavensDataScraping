import { extractBidData } from "./BiddingExtraction";
import { extractMilitaryData } from "./MilitaryExtraction";
import { extractPlayerData } from "./PlayerExtraction";
export const extractGameData = (GameClient) => {
    const GameState = GameClient.entireGame.childGameState;
    const GameLogs = GameState.gameLogManager.logs;
    // GameState.players: BetterMap<User, Player> = new BetterMap();
    const extractedData = {};
    Object.assign(extractedData, extractLogData(GameLogs, [extractBidData, extractMilitaryData]));
    Object.assign(extractedData, extractMiscData(GameClient, [extractPlayerData]));
    return extractedData;
};
export const extractLogData = (logs, Extractors) => {
    const logData = logs.map((log) => log.data);
    const finalObject = {};
    Extractors.forEach((trackerLambda) => {
        Object.assign(finalObject, trackerLambda(logData));
    });
    return finalObject;
};
export const extractMiscData = (GameClient, Extractors) => {
    const finalObject = {};
    Extractors.forEach((extractionLambda) => {
        Object.assign(finalObject, extractionLambda(GameClient));
    });
    return finalObject;
};
//# sourceMappingURL=ExtractGameData.js.map