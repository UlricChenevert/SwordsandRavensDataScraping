"""Python versions of TypeScript extraction contract type definitions.

These are lightweight TypedDict / type-alias definitions used by analysis
and extraction modules. They intentionally use simple primitives for
external values (like Factions and HouseCard) to avoid tight coupling with
the TypeScript sources.
"""
from typing import TypedDict, Dict, List, Optional, Any, Union

# Basic aliases for types coming from GameTypes (kept as strings in Python)
Factions = str
GameLocation = str
HouseCard = str

# ---- Core extracted structures ----
class BattleStats(TypedDict):
    region: str
    winner: str
    loser: str
    winnerArmy: int
    loserArmy: int
    winnerHouseCard: Optional[str]
    loserHouseCard: Optional[str]
    support: int
    location: str
    timestamp: int
    round: int

class ExtractedMilitaryData(TypedDict):
    combatLogs: List[Dict[str, Any]]  # CombatLog can be complex; keep flexible here

class FactionStats(TypedDict, total=False):
    wins: int
    losses: int
    totalBattles: int
    winRate: float
    avgArmySize: float
    avgEnemyArmy: float
    winningHouseCards: Dict[str, int]
    regionVictories: Dict[str, int]
    regionLosses: Dict[str, int]
    winRateOverTime: List[Dict[str, Union[int, float]]]

class ProvinceStats(TypedDict):
    contestedCount: int
    winRate: Dict[str, float]
    criticality: str  # "low"|"medium"|"high"
    avgLossImpact: float
    controllingFactions: Dict[str, int]

class ArmyComposition(TypedDict):
    timestamp: int
    faction: str
    units: List[str]
    totalStrength: int

class LogIndexToGameRound(TypedDict, total=False):
    index: int
    round: int
    wildlingStrength: Optional[int]
    dragonStrength: Optional[int]
    ironThroneTrack: List[Factions]
    fiefdomsTrack: List[Factions]
    kingsCourtTrack: List[Factions]
    housesOnVictoryTrack: List[Dict[str, Any]]  # IHouseSnapshot-like structure
    vsbUsed: Optional[bool]
    ironBank: Optional[Dict[str, Any]]

class BattleLog(TypedDict):
    Attacker: Factions
    AttackerRegion: GameLocation
    Defender: Factions
    AttackedRegion: GameLocation

class BattleParticipantLog(TypedDict, total=False):
    House: Factions
    OrderType: Optional[str]
    OrderBonus: int
    ArmyStrength: int
    ArmyUnits: List[str]
    WoundedUnits: List[str]
    SupportStrength: int
    SupportingFactions: List[Factions]
    RefusedSupport: bool
    GarrisonStrength: int
    HouseCard: Optional[HouseCard]
    HouseCardStrength: int
    HouseCardSelection: List[HouseCard]
    FiefdomTrackPosition: int
    ValyrianSteelBlade: int
    TidesOfBattleCard: Optional[str]
    Total: int

class CombatLog(TypedDict):
    BattleData: BattleLog
    LoserData: BattleParticipantLog
    WinnerData: BattleParticipantLog
    round: int

# AttackLog is a GameLogData variant - we keep as a flexible dict type
AttackLog = Dict[str, Any]

class WildlingTrackData(TypedDict):
    Amount: int
    Faction: Factions
    Round: int

class ExtractedBidData(TypedDict):
    TrackBids: List[Dict[str, Any]]
    WildlingBids: List[WildlingTrackData]

class ProbablyDistribution(TypedDict):
    Probability: Dict[str, float]
    Total: int

# The source JSON uses human-readable keys with spaces (for example
# "Iron Throne Bid Chart"). TypedDict requires valid Python identifiers
# as field names, so represent bid analysis as a flexible mapping and
# provide constants for the commonly used keys.

from typing import TypedDict, Dict, List, Optional, Any, Union, cast


# Strongly-typed representation for bid-analysis data (Python-friendly field names)
class BidAnalysisData(TypedDict, total=False):
    """Typed representation of bid analysis using Python-friendly field names.

    Field names are snake_case to be valid Python identifiers; helper
    functions convert to/from the original JSON keys with spaces.
    """
    iron_throne_distribution: Dict[int, int]
    fiefdom_distribution: Dict[int, int]
    kings_court_distribution: Dict[int, int]
    average_bid: float
    iron_throne_bid_chart: List[List[ProbablyDistribution]]
    fiefdom_bid_chart: List[List[ProbablyDistribution]]
    kings_court_bid_chart: List[List[ProbablyDistribution]]


# Common JSON keys used in analyzed data (human-readable)
IRON_THRONE_DISTRIBUTION = "Iron Throne Distribution"
FIEFDOM_DISTRIBUTION = "Fiefdom Distribution"
KINGS_COURT_DISTRIBUTION = "King's Court Distribution"
AVERAGE_BID = "Average Bid"
IRON_THRONE_BID_CHART = "Iron Throne Bid Chart"
FIEFDOM_BID_CHART = "Fiefdom Bid Chart"
KINGS_COURT_BID_CHART = "King's Court Bid Chart"


def extractBidAnalysis(data: Dict[str, Any]) -> BidAnalysisData:
    """Convert JSON-keyed bid analysis dict into a typed BidAnalysisData."""
    return cast(BidAnalysisData, {
        "iron_throne_distribution": data.get(IRON_THRONE_DISTRIBUTION),
        "fiefdom_distribution": data.get(FIEFDOM_DISTRIBUTION),
        "kings_court_distribution": data.get(KINGS_COURT_DISTRIBUTION),
        "average_bid": data.get(AVERAGE_BID),
        "iron_throne_bid_chart": data.get(IRON_THRONE_BID_CHART),
        "fiefdom_bid_chart": data.get(FIEFDOM_BID_CHART),
        "kings_court_bid_chart": data.get(KINGS_COURT_BID_CHART),
    })

# ScrapedData is keyed by game id and contains a combination of extraction types
ScrapedData = Dict[str, Dict[str, Any]]

__all__ = [
    "Factions",
    "GameLocation",
    "HouseCard",
    "BattleStats",
    "ExtractedMilitaryData",
    "FactionStats",
    "ProvinceStats",
    "ArmyComposition",
    "LogIndexToGameRound",
    "CombatLog",
    "BattleLog",
    "BattleParticipantLog",
    "AttackLog",
    "WildlingTrackData",
    "ExtractedBidData",
    "BidAnalysisData",
    "bid_analysis_from_json",
    "bid_analysis_to_json",
    "IRON_THRONE_BID_CHART",
    "FIEFDOM_BID_CHART",
    "KINGS_COURT_BID_CHART",
    "ScrapedData",
]
