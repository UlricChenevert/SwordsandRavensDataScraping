import { CleanBiddingData } from "../../ScrapedData/GameTypes.js";
import { BidAnalysisData, ScrapedData } from "../Contracts/ExtractionContracts.js";
import { binomial, determineCDF, determineProbabilityMassDistribution, getProbabilityFromCDF } from "../Utilities/Stats.js";

export const analyzeBidDistributions = (data: ScrapedData): BidAnalysisData => {
    const bids: CleanBiddingData[] = Object.values(data)[0].TrackBids

    const ironThroneData = bids.filter((bidData) => bidData.Track == "Iron Throne");
    const fiefdomData = bids.filter((bidData) => bidData.Track == "Fiefdom");
    const kingsCourtData = bids.filter((bidData) => bidData.Track == "King's Court");

    const bidDataAccessor = (element) => element.Amount;

    const ironThroneDistribution = determineProbabilityMassDistribution(ironThroneData, bidDataAccessor);
    const fiefdomDistribution = determineProbabilityMassDistribution(fiefdomData, bidDataAccessor);
    const kingsCourtDistribution = determineProbabilityMassDistribution(kingsCourtData, bidDataAccessor);

    const averageBid =
        bids.length > 0
            ? bids.reduce((sum, bid) => sum + bid.Amount, 0) / bids.length
            : 0;

    return {
        "Iron Throne Distribution": ironThroneDistribution,
        "Iron Throne Bid Chart" : determineBiddingPlacement(ironThroneDistribution),
        "Fiefdom Distribution": fiefdomDistribution,
        "Fiefdom Bid Chart" : determineBiddingPlacement(ironThroneDistribution),
        "King's Court Distribution": kingsCourtDistribution,
        "King's Court Bid Chart" : determineBiddingPlacement(ironThroneDistribution),
        "Average Bid": averageBid,
    };
};

const determineBiddingPlacement = (BidPartialMassDistribution : {[key: number]: number;}, playerCount: number = 8, maxBid = 20) => {
    const finalBidMatrix = []
    const CDF = determineCDF(BidPartialMassDistribution)

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

        finalBidMatrix.push(rankProbabilities)
    }

    return finalBidMatrix;
}