import { tracksMapping } from "../../ScrapedData/GameConstants";
export const extractBidData = (logData) => {
    const trackBidsData = logData.filter((log) => log.type == "clash-of-kings-bidding-done" && log.distributor === null // No Targs
    );
    const trackBids = [];
    trackBidsData.forEach((bidInstance) => {
        bidInstance.results.forEach((bidAmountInstance) => {
            bidAmountInstance[1].forEach((factionBidInstance) => {
                trackBids.push({
                    Track: tracksMapping[bidInstance.trackerI],
                    Amount: bidAmountInstance[0],
                    Faction: factionBidInstance,
                });
            });
        });
    });
    const wildlingBidData = logData.filter((log) => log.type == "wildling-bidding");
    const wildlingBids = [];
    wildlingBidData.forEach((bidInstance) => {
        bidInstance.results.forEach((bidAmountInstance) => {
            bidAmountInstance[1].forEach((factionBidInstance) => {
                wildlingBids.push({
                    Amount: bidAmountInstance[0],
                    Faction: factionBidInstance,
                });
            });
        });
    });
    return { TrackBids: trackBids, WildlingBids: wildlingBids };
};
//# sourceMappingURL=BiddingExtraction.js.map