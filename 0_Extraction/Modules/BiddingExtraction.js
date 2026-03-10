import { tracksMapping } from "../Contracts/GameConstants.js";
export const extractBidData = (logData, gameRoundMapping) => {
    // I am not filtering and then mapping because I need to preserve the log's index to map it's round
    const trackBids = [];
    logData.forEach((log, index) => {
        if (log.type != "clash-of-kings-bidding-done" || log.distributor !== null)
            return;
        // now of type ClashOfKingsBiddingDone
        log.results.forEach((bidAmountInstance) => {
            bidAmountInstance[1].forEach((factionBidInstance) => {
                trackBids.push({
                    Track: tracksMapping[log.trackerI],
                    Amount: bidAmountInstance[0],
                    Faction: factionBidInstance,
                    currentGameStateReferenceIndex: index
                });
            });
        });
    });
    const wildlingBids = [];
    logData.forEach((log, index) => {
        if (log.type != "wildling-bidding")
            return;
        // now of type WildlingBidding
        log.results.forEach((bidAmountInstance) => {
            bidAmountInstance[1].forEach((factionBidInstance) => {
                wildlingBids.push({
                    Amount: bidAmountInstance[0],
                    Faction: factionBidInstance,
                    currentGameStateReferenceIndex: index
                });
            });
        });
    });
    return { TrackBids: trackBids, WildlingBids: wildlingBids };
};
