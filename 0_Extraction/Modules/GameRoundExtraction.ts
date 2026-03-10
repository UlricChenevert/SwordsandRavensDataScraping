import { LogIndexToGameRound } from "../../!Contracts/ExtractionContracts.js"

export const findCorrespondingRound = (targetIndex : number, mapping : LogIndexToGameRound[]) : LogIndexToGameRound => {
    let nextRoundIndex = mapping.findIndex((round)=>round.index >= targetIndex)
    
    const isFound = nextRoundIndex !== -1

    const round = (isFound)?
        mapping[(nextRoundIndex - 1 + mapping.length) % mapping.length] : // for the nextRoundIndex = 0 case
        mapping[mapping.length - 1]

    if (round === undefined) 
        throw `Could not find round for ${targetIndex}`

    return round
}