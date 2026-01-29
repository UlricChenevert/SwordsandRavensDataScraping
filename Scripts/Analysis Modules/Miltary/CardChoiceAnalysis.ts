import { possibleFactions } from "../../../ScrapedData/GameConstants.js";
import { AnalyzedKeys } from "../../Contracts/AnalysisConstants.js";
import { CardChoiceAnalysisData } from "../../Contracts/AnalysisContracts.js";
import { ScrapedData } from "../../Contracts/ExtractionContracts.js";
import { extractCombatLogs, workingCardTotalDistributionFactory, incrementCardDistributionFromBattleParticipant, emptyAverageCardDistributionFactory, averageAllDistributions } from "../../Utilities/MiltaryAnalysisUtilities.js";

export const analyzePossibleCardChoice = (data: ScrapedData) : CardChoiceAnalysisData => {
  const combatLogs = extractCombatLogs(data)

  const workingCardDistributions = workingCardTotalDistributionFactory()

  // per faction
  // Probably buckets: location, opposite side total, non-card strength
  combatLogs.forEach((log) => {
    incrementCardDistributionFromBattleParticipant(log.BattleData.AttackedRegion, log.WinnerData, log.LoserData, workingCardDistributions)
    incrementCardDistributionFromBattleParticipant(log.BattleData.AttackedRegion, log.LoserData, log.WinnerData, workingCardDistributions)
  })

  const factionCardProbabilities = emptyAverageCardDistributionFactory()

  // Average all data
  possibleFactions.forEach((faction) => averageAllDistributions(workingCardDistributions[faction], factionCardProbabilities[faction]))

  return {[AnalyzedKeys.CardChoices]: factionCardProbabilities}
}
