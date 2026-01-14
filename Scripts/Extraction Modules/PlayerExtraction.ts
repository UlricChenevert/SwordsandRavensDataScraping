import { GameClient, IngameGameState } from "../../ScrapedData/GameTypes.js"
import { IGameDataExtractor, PlayerExtraction } from "../Contracts/ExtractionContracts.js"

export const extractPlayerData : IGameDataExtractor<PlayerExtraction> = (client : GameClient) => {
    const GameState : IngameGameState = client.entireGame.childGameState
    const finalPlayerList : {playerID:string, playerName: string}[] = []
    
    GameState.players.forEach(playerEntry=>{
        const finalPlayerData = {
            playerID: playerEntry.user.id, 
            playerName: playerEntry.user.name
        }
        
        finalPlayerList.push(finalPlayerData)
    })

    return {Players : finalPlayerList}
}