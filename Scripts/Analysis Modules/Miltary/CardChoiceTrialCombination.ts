import { possibleFactions, possibleLocations, possibleHouseCards } from "../../../ScrapedData/GameConstants.js";
import { ITrialCombination, ProbablyDistribution, AnalyzedData, CardChoiceAnalysisData } from "../../Contracts/AnalysisContracts.js";
import { HouseCard } from "../../../ScrapedData/GameTypes.js";
import { combineCardDistributionForMap, combineCardDistributions, emptyAverageCardDistributionFactory } from "../../Utilities/MiltaryAnalysisUtilities.js";
import { AnalyzedKeys } from "../../Contracts/AnalysisConstants.js";

export const CardChoiceTrialCombination : ITrialCombination<CardChoiceAnalysisData> = (trials, combinedData: AnalyzedData)=>{
    if (combinedData[AnalyzedKeys.CardChoices] === undefined) combinedData[AnalyzedKeys.CardChoices] = emptyAverageCardDistributionFactory()
    
    const result = combinedData[AnalyzedKeys.CardChoices]
    
    trials.forEach((trial)=>{
        possibleFactions.forEach((faction)=>{
            const trialFactionStats = trial[AnalyzedKeys.CardChoices][faction]

            possibleLocations.forEach((location)=>{
                combineCardDistributions(
                    trialFactionStats.LocationDistributions[location], 
                    result[faction].LocationDistributions[location]
                )
            })

            trialFactionStats.NonCardStrengthDistributions.forEach((probablyDistribution, strength)=>{
                combineCardDistributionForMap(result[faction].NonCardStrengthDistributions, strength, probablyDistribution)
            })

            trialFactionStats.OppositeSideStrengthDistributions.forEach((probablyDistribution, strength)=>{
                combineCardDistributionForMap(result[faction].OppositeSideStrengthDistributions, strength, probablyDistribution)
            })
        })
    })

    // possibleFactions.forEach((faction)=>{

    //     // NonCardStrengthDistributions
    //     const nonCardKeys = new Set<number>()
    //     trials.forEach((trial)=>trial[AnalyzedKeys.CardChoices][faction].NonCardStrengthDistributions.forEach((val, k)=>nonCardKeys.add(k)))

    //     nonCardKeys.forEach((key)=>{
    //     const accum = new Map<HouseCard, number>()
    //     possibleHouseCards.forEach((card)=>accum.set(card, 0))
    //     let contributors = 0

    //     trials.forEach((trial)=>{
    //         const td = trial[AnalyzedKeys.CardChoices][faction].NonCardStrengthDistributions.get(key)
    //         if (td === undefined) return
    //         contributors++
    //         td.Probability.forEach((prob, card)=> accum.set(card, (accum.get(card) || 0) + prob))
    //     })

    //     const pd: ProbablyDistribution = {Probability: new Map<HouseCard, number>(), Total: contributors}
    //     accum.forEach((sum, card)=> pd.Probability.set(card, contributors>0 ? sum / contributors : 0))
    //     result[faction].NonCardStrengthDistributions.set(key, pd)
    //     })

    //     // OppositeSideStrengthDistributions
    //     const oppKeys = new Set<number>()
    //     trials.forEach((trial)=>trial[AnalyzedKeys.CardChoices][faction].OppositeSideStrengthDistributions.forEach((val, k)=>oppKeys.add(k)))

    //     oppKeys.forEach((key)=>{
    //     const accum = new Map<HouseCard, number>()
    //     possibleHouseCards.forEach((card)=>accum.set(card, 0))
    //     let contributors = 0

    //     trials.forEach((trial)=>{
    //         const td = trial[AnalyzedKeys.CardChoices][faction].OppositeSideStrengthDistributions.get(key)
    //         if (td === undefined) return
    //         contributors++
    //         td.Probability.forEach((prob, card)=> accum.set(card, (accum.get(card) || 0) + prob))
    //     })

    //     const pd: ProbablyDistribution = {Probability: new Map<HouseCard, number>(), Total: contributors}
    //     accum.forEach((sum, card)=> pd.Probability.set(card, contributors>0 ? sum / contributors : 0))
    //     result[faction].OppositeSideStrengthDistributions.set(key, pd)
    //     })
    // })

    return result
}
