import { GameLog } from "../../ScrapedData/GameTypes";
import { IGameDataExtractor } from "../Contracts/ExtractionContracts";

export const extractGameData = (logs : GameLog[], Trackers : IGameDataExtractor<object>[]) => {
    const logData = logs.map((log)=>log.data)

    const finalObject = {}

    Trackers.forEach((trackerLambda)=>{
        Object.assign(finalObject, trackerLambda(logData))
    })

    return finalObject
}
