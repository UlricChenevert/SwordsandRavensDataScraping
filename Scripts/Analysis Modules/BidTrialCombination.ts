import { BidAnalysisData } from "../Contracts/ExtractionContracts.js";
import { AnalyzedData, ITrialCombination } from "../Contracts/AnalysisContracts.js";
import { determineCDF, getProbabilityFromCDF, binomial } from "../Utilities/Stats.js";

export const BidTrialCombination : ITrialCombination<BidAnalysisData> = (trials, combinedData: AnalyzedData) => {
    
    if (trials.length === 0) return;
    if (combinedData["Iron Throne Distribution"] !== undefined) combinedData["Iron Throne Distribution"] = {}
    if (combinedData["Fiefdom Distribution"] !== undefined) combinedData["Fiefdom Distribution"] = {}
    if (combinedData["King's Court Distribution"] !== undefined) combinedData["King's Court Distribution"] = {}
    if (combinedData["Average Bid"] !== undefined) combinedData["Average Bid"] = 0
    if (combinedData["Fiefdom Bid Chart"] !== undefined) combinedData["Fiefdom Bid Chart"] = []
    if (combinedData["King's Court Bid Chart"] !== undefined) combinedData["King's Court Bid Chart"] = []

    

    combinedData["Iron Throne Distribution"] = averageDistribution("Iron Throne Distribution", trials);
    combinedData["Fiefdom Distribution"] = averageDistribution("Fiefdom Distribution", trials);
    combinedData["King's Court Distribution"] = averageDistribution("King's Court Distribution", trials);

    // Average the "Average Bid" over trials
    combinedData["Average Bid"] = trials.reduce((acc, t) => acc + (t["Average Bid"] || 0), 0) / trials.length;

    // Recompute bid charts from the averaged distributions using the same logic as analyzeBidDistributions
    combinedData["Iron Throne Bid Chart"] = determineBiddingPlacement(combinedData["Iron Throne Distribution"] as {[key:number]:number});
    combinedData["Fiefdom Bid Chart"] = determineBiddingPlacement(combinedData["Fiefdom Distribution"] as {[key:number]:number});
    combinedData["King's Court Bid Chart"] = determineBiddingPlacement(combinedData["King's Court Distribution"] as {[key:number]:number});

    return combinedData;
};

// Helper to average distributions across trials
    const averageDistribution = (key: keyof BidAnalysisData, trials: BidAnalysisData[]) => {
        const sums: {[key: number]: number} = {};

        trials.forEach((trial) => {
        const dist = trial[key] as {[key: number]: number} | undefined;
        if (!dist) return;
        
        for (const k of Object.keys(dist)) {
            const n = parseInt(k);
            sums[n] = (sums[n] || 0) + (dist[n] as number);
        }
        });

        const out: {[key: number]: number} = {};
        for (const k of Object.keys(sums)) {
        const n = parseInt(k);
        out[n] = sums[n] / trials.length;
        }

        return out;
    };

const determineBiddingPlacement = (BidPartialMassDistribution : {[key: number]: number;}, playerCount: number = 8, maxBid = 20) => {
        const finalBidMatrix = [];
        const CDF = determineCDF(BidPartialMassDistribution);

        const numOpponents = playerCount - 1;

        for(let bid = 0; bid < maxBid; bid++) {
        const probability = getProbabilityFromCDF(bid, CDF)

        const rankProbabilities = [];
    
        // 2. Calculate probability for each possible rank (1st to Nth)
        for (let numberOfOutbiddingPeople = 0; numberOfOutbiddingPeople <= numOpponents; numberOfOutbiddingPeople++) {
            
            // k is the number of people who bid HIGHER than you
            const probOfKAbove = 
                binomial(numOpponents, numberOfOutbiddingPeople) 
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