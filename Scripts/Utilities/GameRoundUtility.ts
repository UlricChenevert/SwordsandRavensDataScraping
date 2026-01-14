import { LogIndexToGameRound } from "../Contracts/ExtractionContracts.js"

export const findCorrespondingRound = (targetIndex : number, mapping : LogIndexToGameRound[]) : LogIndexToGameRound => {
    let nextRoundIndex = mapping.findIndex((round)=>round.index >= targetIndex)
    
    if (nextRoundIndex === -1) return mapping[mapping.length - 1]

    return mapping[nextRoundIndex - 1]
}