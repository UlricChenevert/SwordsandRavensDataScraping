import { tracksMapping } from "../../ScrapedData/GameConstants";
import { BidTracks, ClashOfKingsBiddingDone, CleanBiddingData, Factions, GameLogData, WildlingBidding } from "../../ScrapedData/GameTypes";
import { BidAnalysisData, ExtractedBidData, IGameLogDataExtractor, WildingTrackData } from "../Contracts/ExtractionContracts";
import { determineProbabilityMassDistribution } from "../Utilities/Stats";

export const extractBidData: IGameLogDataExtractor<ExtractedBidData> = (logData: GameLogData[]): ExtractedBidData => {
    const trackBidsData: ClashOfKingsBiddingDone[] = logData.filter(
        (log) => log.type == "clash-of-kings-bidding-done" && log.distributor === null // No Targs
    ) as ClashOfKingsBiddingDone[];

    const trackBids: CleanBiddingData[] = [];

    trackBidsData.forEach((bidInstance) => {
        bidInstance.results.forEach((bidAmountInstance) => {
            bidAmountInstance[1].forEach((factionBidInstance) => {
                trackBids.push({
                    Track: tracksMapping[bidInstance.trackerI],
                    Amount: bidAmountInstance[0],
                    Faction: factionBidInstance as Factions,
                });
            });
        });
    });

    const wildlingBidData : WildlingBidding[] = logData.filter((log)=>log.type == "wildling-bidding")
    const wildlingBids : WildingTrackData[] = []

    wildlingBidData.forEach((bidInstance) => {
        bidInstance.results.forEach((bidAmountInstance) => {
            bidAmountInstance[1].forEach((factionBidInstance) => {
                wildlingBids.push({
                    Amount: bidAmountInstance[0],
                    Faction: factionBidInstance as Factions,
                });
            });
        });
    });

    return {TrackBids: trackBids, WildlingBids: wildlingBids};
};