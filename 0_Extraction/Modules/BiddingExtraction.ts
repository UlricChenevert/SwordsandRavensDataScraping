import { IGameLogDataExtractor, ExtractedBidData, CleanBiddingData, WildingTrackData } from "../../!Contracts/ExtractionContracts.js";
import { tracksMapping } from "../Contracts/GameConstants.js";
import { BidTracks, Factions, GameLogData } from "../Contracts/GameTypes.js";
import { findCorrespondingRound } from "./GameRoundExtraction.js";

export const extractBidData: IGameLogDataExtractor<ExtractedBidData> = (logData: GameLogData[], gameRoundMapping): ExtractedBidData => {
    // I am not filtering and then mapping because I need to preserve the log's index to map it's round
    const trackBids: CleanBiddingData[] = [];
    
    logData.forEach((log, index)=>{
        if (log.type != "clash-of-kings-bidding-done" || log.distributor !== null) return

        // now of type ClashOfKingsBiddingDone

        log.results.forEach((bidAmountInstance) => {
            bidAmountInstance[1].forEach((factionBidInstance) => {
                trackBids.push({
                    Track: tracksMapping[log.trackerI] as BidTracks,
                    Amount: bidAmountInstance[0],
                    Faction: factionBidInstance as Factions,
                    currentGameStateReferenceIndex: index
                });
            });
        });
    })

    const wildlingBids : WildingTrackData[] = []

    logData.forEach((log, index)=>{
        if (log.type != "wildling-bidding") return

        // now of type WildlingBidding

        log.results.forEach((bidAmountInstance) => {
            bidAmountInstance[1].forEach((factionBidInstance) => {
                wildlingBids.push({
                    Amount: bidAmountInstance[0],
                    Faction: factionBidInstance as Factions,
                    currentGameStateReferenceIndex: index
                });
            });
        });
    })

    return {TrackBids: trackBids, WildlingBids: wildlingBids};
};