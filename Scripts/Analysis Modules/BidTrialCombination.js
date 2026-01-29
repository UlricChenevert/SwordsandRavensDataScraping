import { determineCDF, getProbabilityFromCDF, binomial } from "../Utilities/Stats.js";
export const BidTrialCombination = (trials, combinedData) => {
    if (trials.length === 0)
        return;
    if (combinedData["Iron Throne Distribution"] !== undefined)
        combinedData["Iron Throne Distribution"] = {};
    if (combinedData["Fiefdom Distribution"] !== undefined)
        combinedData["Fiefdom Distribution"] = {};
    if (combinedData["King's Court Distribution"] !== undefined)
        combinedData["King's Court Distribution"] = {};
    if (combinedData["Average Bid"] !== undefined)
        combinedData["Average Bid"] = 0;
    if (combinedData["Fiefdom Bid Chart"] !== undefined)
        combinedData["Fiefdom Bid Chart"] = [];
    if (combinedData["King's Court Bid Chart"] !== undefined)
        combinedData["King's Court Bid Chart"] = [];
    combinedData["Iron Throne Distribution"] = averageDistribution("Iron Throne Distribution", trials);
    combinedData["Fiefdom Distribution"] = averageDistribution("Fiefdom Distribution", trials);
    combinedData["King's Court Distribution"] = averageDistribution("King's Court Distribution", trials);
    // Average the "Average Bid" over trials
    combinedData["Average Bid"] = trials.reduce((acc, t) => acc + (t["Average Bid"] || 0), 0) / trials.length;
    // Recompute bid charts from the averaged distributions using the same logic as analyzeBidDistributions
    combinedData["Iron Throne Bid Chart"] = determineBiddingPlacement(combinedData["Iron Throne Distribution"]);
    combinedData["Fiefdom Bid Chart"] = determineBiddingPlacement(combinedData["Fiefdom Distribution"]);
    combinedData["King's Court Bid Chart"] = determineBiddingPlacement(combinedData["King's Court Distribution"]);
    return combinedData;
};
// Helper to average distributions across trials
const averageDistribution = (key, trials) => {
    const sums = {};
    trials.forEach((trial) => {
        const dist = trial[key];
        if (!dist)
            return;
        for (const k of Object.keys(dist)) {
            const n = parseInt(k);
            sums[n] = (sums[n] || 0) + dist[n];
        }
    });
    const out = {};
    for (const k of Object.keys(sums)) {
        const n = parseInt(k);
        out[n] = sums[n] / trials.length;
    }
    return out;
};
const determineBiddingPlacement = (BidPartialMassDistribution, playerCount = 8, maxBid = 20) => {
    const finalBidMatrix = [];
    const CDF = determineCDF(BidPartialMassDistribution);
    const numOpponents = playerCount - 1;
    for (let bid = 0; bid < maxBid; bid++) {
        const probability = getProbabilityFromCDF(bid, CDF);
        const rankProbabilities = [];
        // 2. Calculate probability for each possible rank (1st to Nth)
        for (let numberOfOutbiddingPeople = 0; numberOfOutbiddingPeople <= numOpponents; numberOfOutbiddingPeople++) {
            // k is the number of people who bid HIGHER than you
            const probOfKAbove = binomial(numOpponents, numberOfOutbiddingPeople)
                * Math.pow(1 - probability, numberOfOutbiddingPeople)
                * Math.pow(probability, numOpponents - numberOfOutbiddingPeople);
            rankProbabilities.push({
                rank: numberOfOutbiddingPeople + 1,
                probability: probOfKAbove
            });
        }
        finalBidMatrix.push(rankProbabilities);
    }
    return finalBidMatrix;
};
//# sourceMappingURL=BidTrialCombination.js.map