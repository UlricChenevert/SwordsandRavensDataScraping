import { possibleHouseCards, possibleFactions, possibleLocations } from "../../ScrapedData/GameConstants.js";
import { Factions, GameLocation, HouseCard } from "../../ScrapedData/GameTypes.js";
import { CardChoiceProbabilityBuckets, ProbablyDistribution, SumDistribution, WorkingCardTotalDistributions } from "../Contracts/AnalysisContracts.js";
import { BattleParticipantLog, CombatLog, ScrapedData } from "../Contracts/ExtractionContracts.js";

export const extractCombatLogs = (data: ScrapedData): CombatLog[] => {
  return Object.values(data)[0].combatLogs;
};

const cardSumDistributionFactory = () : SumDistribution => {
  return {SumDistribution: new Map<HouseCard, number>(), Total : 0} as SumDistribution
}

const cardProbablyDistributionFactory = () : ProbablyDistribution => {
  return {Probability: new Map<HouseCard, number>(), Total : 0} as ProbablyDistribution
}

export const workingCardTotalDistributionFactory = () : Record<Factions, WorkingCardTotalDistributions> => {
  const finalBuckets = {}

  possibleFactions
    .forEach((faction)=>{
      const location = {}
      
      possibleLocations.forEach((locationName) => {
        location[locationName] = cardSumDistributionFactory();
      });

      finalBuckets[faction] = {
        LocationDistributions: location as Record<GameLocation, SumDistribution>,
        OppositeSideStrengthDistributions: new Map<number, SumDistribution>(),
        NonCardStrengthDistributions: new Map<number, SumDistribution>()
      }})

    return finalBuckets as Record<Factions, WorkingCardTotalDistributions>
}

export const emptyAverageCardDistributionFactory = () : Record<Factions, CardChoiceProbabilityBuckets> => {
  const finalBuckets = {}

  possibleFactions
    .forEach((faction)=>{
      const location = {}
      
      possibleLocations.forEach((locationName) => {
        location[locationName] = cardProbablyDistributionFactory();
      });

      finalBuckets[faction] = {
        LocationDistributions: location as Record<GameLocation, ProbablyDistribution>,
        OppositeSideStrengthDistributions: new Map<number, ProbablyDistribution>(),
        NonCardStrengthDistributions: new Map<number, ProbablyDistribution>()
      }})

    return finalBuckets as Record<Factions, CardChoiceProbabilityBuckets>
}

export const incrementCardDistribution = (record : SumDistribution, houseCard : HouseCard) => {
  const cardAppearances : number | undefined = record.SumDistribution.get(houseCard)

  if (cardAppearances === undefined)
    record.SumDistribution.set(houseCard, 1)
  else
    record.SumDistribution.set(houseCard, cardAppearances + 1)

  record.Total += 1
}

export const incrementCardDistributionForMap = <T>(map: Map<T, SumDistribution>, key : T, houseCard : HouseCard) => {
  let cardDistributions : SumDistribution | undefined = map.get(key)
  if (cardDistributions === undefined) {
    cardDistributions = cardSumDistributionFactory()
    map.set(key, cardDistributions)
  }
  
  incrementCardDistribution(cardDistributions, houseCard)
}

export const incrementCardDistributionFromBattleParticipant = (
    location : GameLocation,
    mainParticipant : BattleParticipantLog,
    secondaryParticipant : BattleParticipantLog,
    workingCardDistributions : Record<Factions, WorkingCardTotalDistributions>
  ) => {
    const mainParticipantCard = mainParticipant.HouseCard
    const mainParticipantNonCardStrength = mainParticipant.Total - mainParticipant.HouseCardStrength
    const secondaryParticipantStrength = secondaryParticipant.Total
    const factionDistributions = workingCardDistributions[mainParticipant.House]

  incrementCardDistribution(factionDistributions.LocationDistributions[location], mainParticipantCard)
  incrementCardDistributionForMap(factionDistributions.NonCardStrengthDistributions, mainParticipantNonCardStrength, mainParticipantCard)
  incrementCardDistributionForMap(factionDistributions.OppositeSideStrengthDistributions, secondaryParticipantStrength, mainParticipantCard)
}

export const averageAllDistributions = (workingCardDistributions : WorkingCardTotalDistributions, targetCardDistribution : CardChoiceProbabilityBuckets) : CardChoiceProbabilityBuckets => {
  possibleLocations.forEach((location)=>{
    const workingLocationDataRef = workingCardDistributions.LocationDistributions[location]

    workingLocationDataRef.SumDistribution.forEach((count, usedHouseCard)=>{
      targetCardDistribution.LocationDistributions[location].Probability[usedHouseCard] = count / workingLocationDataRef.Total
    })
  })

  workingCardDistributions.NonCardStrengthDistributions.forEach((distribution, nonCardStrength)=>{
    const probablyDistribution = cardProbablyDistributionFactory()

    distribution.SumDistribution.forEach((count, usedHouseCard)=>{
      probablyDistribution.Probability.set(usedHouseCard, count / distribution.Total)
    })

    targetCardDistribution.NonCardStrengthDistributions.set(nonCardStrength, probablyDistribution)
  })

  workingCardDistributions.OppositeSideStrengthDistributions.forEach((distribution, oppositeStrength)=>{
    const probablyDistribution = cardProbablyDistributionFactory()

    distribution.SumDistribution.forEach((count, usedHouseCard)=>{
      probablyDistribution.Probability.set(usedHouseCard, count / distribution.Total)
    })

    targetCardDistribution.OppositeSideStrengthDistributions.set(oppositeStrength, probablyDistribution)
  })

  return targetCardDistribution
}