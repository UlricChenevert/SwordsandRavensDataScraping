import { possibleFactions, possibleLocations } from "../../ScrapedData/GameConstants.js";
export const extractCombatLogs = (data) => {
    return Object.values(data)[0].combatLogs;
};
const cardSumDistributionFactory = () => {
    return { SumDistribution: new Map(), Total: 0 };
};
const cardProbablyDistributionFactory = () => {
    return { Probability: new Map(), Total: 0 };
};
export const workingCardTotalDistributionFactory = () => {
    const finalBuckets = {};
    possibleFactions
        .forEach((faction) => {
        const location = {};
        possibleLocations.forEach((locationName) => {
            location[locationName] = cardSumDistributionFactory();
        });
        finalBuckets[faction] = {
            LocationDistributions: location,
            OppositeSideStrengthDistributions: new Map(),
            NonCardStrengthDistributions: new Map()
        };
    });
    return finalBuckets;
};
export const emptyAverageCardDistributionFactory = () => {
    const finalBuckets = {};
    possibleFactions
        .forEach((faction) => {
        const location = {};
        possibleLocations.forEach((locationName) => {
            location[locationName] = cardProbablyDistributionFactory();
        });
        finalBuckets[faction] = {
            LocationDistributions: location,
            OppositeSideStrengthDistributions: new Map(),
            NonCardStrengthDistributions: new Map()
        };
    });
    return finalBuckets;
};
export const incrementCardDistribution = (record, houseCard) => {
    const cardAppearances = record.SumDistribution.get(houseCard);
    if (cardAppearances === undefined)
        record.SumDistribution.set(houseCard, 1);
    else
        record.SumDistribution.set(houseCard, cardAppearances + 1);
    record.Total += 1;
};
export const combineCardDistributions = (newDistribution, targetDistribution) => {
    if (newDistribution === undefined)
        return;
    if (targetDistribution === undefined) {
        targetDistribution = newDistribution;
        return;
    }
    const newTotal = targetDistribution.Total + newDistribution.Total;
    newDistribution.Probability.forEach((newProbability, houseCard) => {
        const targetProbably = targetDistribution.Probability.get(houseCard);
        if (targetProbably === undefined)
            targetDistribution.Probability.set(houseCard, newProbability);
        else
            targetDistribution.Probability.set(houseCard, (targetProbably * targetDistribution.Total + newProbability * newDistribution.Total) / newTotal);
    });
    targetDistribution.Total = newTotal;
};
export const combineCardDistributionForMap = (oldDistributionMap, key, newProbabilityDistribution) => {
    let oldCardDistribution = oldDistributionMap.get(key);
    if (oldCardDistribution === undefined) {
        oldCardDistribution = cardProbablyDistributionFactory();
        oldDistributionMap.set(key, newProbabilityDistribution);
    }
    combineCardDistributions(oldCardDistribution, newProbabilityDistribution);
};
export const incrementCardDistributionForMap = (map, key, houseCard) => {
    let cardDistributions = map.get(key);
    if (cardDistributions === undefined) {
        cardDistributions = cardSumDistributionFactory();
        map.set(key, cardDistributions);
    }
    incrementCardDistribution(cardDistributions, houseCard);
};
export const incrementCardDistributionFromBattleParticipant = (location, mainParticipant, secondaryParticipant, workingCardDistributions) => {
    const mainParticipantCard = mainParticipant.HouseCard;
    const mainParticipantNonCardStrength = mainParticipant.Total - mainParticipant.HouseCardStrength;
    const secondaryParticipantStrength = secondaryParticipant.Total;
    const factionDistributions = workingCardDistributions[mainParticipant.House];
    incrementCardDistribution(factionDistributions.LocationDistributions[location], mainParticipantCard);
    incrementCardDistributionForMap(factionDistributions.NonCardStrengthDistributions, mainParticipantNonCardStrength, mainParticipantCard);
    incrementCardDistributionForMap(factionDistributions.OppositeSideStrengthDistributions, secondaryParticipantStrength, mainParticipantCard);
};
export const averageAllDistributions = (workingCardDistributions, targetCardDistribution) => {
    possibleLocations.forEach((location) => {
        const workingLocationDataRef = workingCardDistributions.LocationDistributions[location];
        workingLocationDataRef.SumDistribution.forEach((count, usedHouseCard) => {
            targetCardDistribution.LocationDistributions[location].Probability[usedHouseCard] = count / workingLocationDataRef.Total;
        });
    });
    workingCardDistributions.NonCardStrengthDistributions.forEach((distribution, nonCardStrength) => {
        const probablyDistribution = cardProbablyDistributionFactory();
        distribution.SumDistribution.forEach((count, usedHouseCard) => {
            probablyDistribution.Probability.set(usedHouseCard, count / distribution.Total);
        });
        targetCardDistribution.NonCardStrengthDistributions.set(nonCardStrength, probablyDistribution);
    });
    workingCardDistributions.OppositeSideStrengthDistributions.forEach((distribution, oppositeStrength) => {
        const probablyDistribution = cardProbablyDistributionFactory();
        distribution.SumDistribution.forEach((count, usedHouseCard) => {
            probablyDistribution.Probability.set(usedHouseCard, count / distribution.Total);
        });
        targetCardDistribution.OppositeSideStrengthDistributions.set(oppositeStrength, probablyDistribution);
    });
    return targetCardDistribution;
};
//# sourceMappingURL=MiltaryAnalysisUtilities.js.map