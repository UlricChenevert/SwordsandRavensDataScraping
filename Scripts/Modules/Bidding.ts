import { BidTracks, ClashOfKingsBiddingDone, CleanBiddingData, Factions, GameLogData } from "../../ScrapedData/GameTypes";
import { IGameDataExtractor } from "../Contracts/ExtractionContracts";
import { determineProbabilityMassDistribution } from "../Utilities/Stats";

export const BiddingTracker : IGameDataExtractor<ExtractedBidData> = (logData : GameLogData[]) => {
    const bidsData : ClashOfKingsBiddingDone[] = logData.filter(
    (log)=>log.type == "clash-of-kings-bidding-done" && 
            log.distributor === null // No Targs
    ) as ClashOfKingsBiddingDone[]

    const bids : CleanBiddingData[] = [];

    bidsData.forEach((bidInstance)=>{
        bidInstance.results.forEach((bidAmountInstance)=>{
            bidAmountInstance[1].forEach((factionBidInstance)=>{
                bids.push({
                    "Track" : tracksMapping[bidInstance.trackerI], 
                    "Amount": bidAmountInstance[0], 
                    "Faction": factionBidInstance as Factions
                    })
            })
        })
    })


    const AverageBid = 0;

    const ironThroneData = bids.filter((bidData)=>bidData.Track == "Iron Throne")
    const fiefdomData = bids.filter((bidData)=>bidData.Track == "Fiefdom")
    const kingsCourtData = bids.filter((bidData)=>bidData.Track == "King's Court")

    const bidDataAccessor = (element)=>element.Amount

    const ironThroneDistribution = determineProbabilityMassDistribution(ironThroneData, bidDataAccessor)
    const fiefdomDistribution = determineProbabilityMassDistribution(fiefdomData, bidDataAccessor)
    const kingsCourtDistribution = determineProbabilityMassDistribution(kingsCourtData, bidDataAccessor)

    return {
        "Bids" : bids,
        "Iron Throne Distribution" : ironThroneDistribution,
        "Fiefdom Distribution" : fiefdomDistribution,
        "King's Court Distribution" : kingsCourtDistribution,
        "Average Bid": AverageBid
    }
}

type ExtractedBidData = {
    "Bids" : CleanBiddingData[],
    "Iron Throne Distribution" : {[key: number]: number},
    "Fiefdom Distribution" : {[key: number]: number},
    "King's Court Distribution" : {[key: number]: number},
    "Average Bid": number
}

const tracksMapping : {[key: number]: BidTracks} = {
    0: "Iron Throne",
    1: "Fiefdom",
    2: "King's Court"
}