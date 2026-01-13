import { GameClient, GameLog, IngameGameState } from "../../ScrapedData/GameTypes";
import { IGameDataExtractor, IGameLogDataExtractor } from "../Contracts/ExtractionContracts";
import { extractBidData } from "./BiddingExtraction";
import { DownloadData } from "./DownloadData";
import { extractMilitaryData } from "./MilitaryExtraction";
import { extractPlayerData } from "./PlayerExtraction";

export const extractGameData = (GameClient : GameClient) => {
    const GameState = GameClient.entireGame.childGameState
    const GameLogs = GameState.gameLogManager.logs
    
    // GameState.players: BetterMap<User, Player> = new BetterMap();

    const extractedData = {}

    Object.assign(extractedData, extractLogData(GameLogs, [extractBidData, extractMilitaryData]))
    Object.assign(extractedData, extractMiscData(GameClient, [extractPlayerData]))

    return extractedData

}

export const extractLogData = (logs : GameLog[], Extractors : IGameLogDataExtractor<object>[]) => {
    const logData = logs.map((log)=>log.data)

    const finalObject = {}

    Extractors.forEach((trackerLambda)=>{
        Object.assign(finalObject, trackerLambda(logData))
    })

    return finalObject
}

export const extractMiscData = (GameClient : GameClient, Extractors : IGameDataExtractor<object>[]) => {
    
    const finalObject = {}

    Extractors.forEach((extractionLambda)=>{
        Object.assign(finalObject, extractionLambda(GameClient))
    })

    return finalObject
}
