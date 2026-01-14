import { determineProbabilityMassDistribution } from "../Utilities/Stats.js";
export const analyzeBidDistributions = (bids) => {
    const ironThroneData = bids.filter((bidData) => bidData.Track == "Iron Throne");
    const fiefdomData = bids.filter((bidData) => bidData.Track == "Fiefdom");
    const kingsCourtData = bids.filter((bidData) => bidData.Track == "King's Court");
    const bidDataAccessor = (element) => element.Amount;
    const ironThroneDistribution = determineProbabilityMassDistribution(ironThroneData, bidDataAccessor);
    const fiefdomDistribution = determineProbabilityMassDistribution(fiefdomData, bidDataAccessor);
    const kingsCourtDistribution = determineProbabilityMassDistribution(kingsCourtData, bidDataAccessor);
    const averageBid = bids.length > 0
        ? bids.reduce((sum, bid) => sum + bid.Amount, 0) / bids.length
        : 0;
    return {
        "Iron Throne Distribution": ironThroneDistribution,
        "Fiefdom Distribution": fiefdomDistribution,
        "King's Court Distribution": kingsCourtDistribution,
        "Average Bid": averageBid,
    };
};
//# sourceMappingURL=AnalyzeBids.js.map