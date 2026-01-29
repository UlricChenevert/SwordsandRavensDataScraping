"""Python equivalents of TypeScript analysis contract definitions.

Defines typed structures used when analyzers create and combine analysis output.
"""
from typing import TypedDict, Dict, List, Callable, Any
from AnalysisConstants import AnalyzedKeys
from ExtractionContracts import (
    FactionStats,
    ProvinceStats,
    ArmyComposition,
    ScrapedData,
    BidAnalysisData,
    Factions,
    GameLocation,
    HouseCard,
)

# ---- Helper distributions ----
class SumDistribution(TypedDict):
    SumDistribution: Dict[HouseCard, int]
    Total: int

class ProbablyDistribution(TypedDict):
    Probability: Dict[HouseCard, int]
    Total: int

class WorkingCardTotalDistributions(TypedDict):
    LocationDistributions: Dict[GameLocation, SumDistribution]
    OppositeSideStrengthDistributions: Dict[int, SumDistribution]
    NonCardStrengthDistributions: Dict[int, SumDistribution]

class CardChoiceProbabilityBuckets(TypedDict):
    LocationDistributions: Dict[GameLocation, ProbablyDistribution]
    OppositeSideStrengthDistributions: Dict[int, ProbablyDistribution]
    NonCardStrengthDistributions: Dict[int, ProbablyDistribution]

# ---- Analysis result fragments ----
class BattleAreaAnalysis(TypedDict):
    BattleAreas: Dict[str, int]

class BattleStrategyCounts(TypedDict):
    aggressive: int
    decisive: int
    passive: int

class BattleStrategyAnalysis(TypedDict):
    BattleStrategies: Dict[str, BattleStrategyCounts]

class ProvinceDistributionAnalysis(TypedDict):
    ProvinceDistributions: Dict[str, ProvinceStats]

class ProvinceControlAnalysis(TypedDict):
    ProvinceControl: Dict[str, Dict[str, int]]

class ArmyCompositionAnalysis(TypedDict):
    ArmyCompositionTimeline: List[ArmyComposition]

class ProvinceCountTimelineAnalysis(TypedDict):
    ProvinceCountTimeline: List[Dict[str, Any]]  # {timestamp: int, faction: str, count: int}

class MiliaryFactionStatistics(TypedDict):
    # Keyed by AnalyzedKeys.MiliaryFactionStatistics
    pass

# For convenience we use a general AnalyzedData type. The original TypeScript
# defines a Partial of many composite types. In Python we represent that as a
# flexible mapping from string keys to arbitrary JSON-serializable values.
AnalyzedData = Dict[str, Any]

# Analyzer callable types
IGameDataAnalyzer = Callable[[ScrapedData], dict]
ITrialCombination = Callable[[List[dict], AnalyzedData], None]

# Card choice analysis data mapping
CardChoiceAnalysisData = Dict[str, Dict[Factions, CardChoiceProbabilityBuckets]]

analysisTypes = (
    BattleAreaAnalysis,
    BattleStrategyAnalysis,
    ProvinceDistributionAnalysis,
    ProvinceControlAnalysis,
    ArmyCompositionAnalysis,
    ProvinceCountTimelineAnalysis,
    MiliaryFactionStatistics,
    BidAnalysisData,
    CardChoiceAnalysisData,
)

__all__ = [
    "SumDistribution",
    "ProbablyDistribution",
    "WorkingCardTotalDistributions",
    "CardChoiceProbabilityBuckets",
    "BattleAreaAnalysis",
    "BattleStrategyAnalysis",
    "ProvinceDistributionAnalysis",
    "ProvinceControlAnalysis",
    "ArmyCompositionAnalysis",
    "ProvinceCountTimelineAnalysis",
    "MiliaryFactionStatistics",
    "IGameDataAnalyzer",
    "ITrialCombination",
    "analysisTypes",
    "CardChoiceAnalysisData",
    "AnalyzedData",
]
