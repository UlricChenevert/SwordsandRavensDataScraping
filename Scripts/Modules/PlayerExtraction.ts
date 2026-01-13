import { GameClient, IngameGameState } from "../../ScrapedData/GameTypes"
import { IGameDataExtractor, PlayerExtraction } from "../Contracts/ExtractionContracts"

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