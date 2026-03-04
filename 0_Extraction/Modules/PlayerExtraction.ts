import { GameClient, IngameGameState } from "../Contracts/GameTypes.js"
import { IGameDataExtractor, PlayerExtraction } from "../../Contracts/ExtractionContracts.js"

export const extractPlayerData : IGameDataExtractor<PlayerExtraction> = (client : GameClient) => {
    const GameState : IngameGameState | undefined = client.entireGame?.childGameState
    if (GameState === undefined) 
        throw "Cannot fetch player list!"

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