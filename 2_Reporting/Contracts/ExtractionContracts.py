"""Python TypedDict definitions mirroring ExtractionContracts.d.ts."""

from typing import Dict, List, Literal, Optional, TypedDict


# ---------------------------------------------------------------------------
# Primitive type aliases (mirroring TypeScript union types)
# ---------------------------------------------------------------------------

Factions = Literal[
    "baratheon", "tyrell", "lannister", "arryn",
    "greyjoy", "targaryen", "martell", "stark", "unknown"
]

BidTracks = Literal["Iron Throne", "Fiefdom", "King's Court"]

# String from the known set of game locations (see 0_Extraction/Contracts/GameConstants.ts)
GameLocation = str

# String from the known set of house card IDs (see 0_Extraction/Contracts/GameConstants.ts)
HouseCard = str


# ---------------------------------------------------------------------------
# Nested structures
# ---------------------------------------------------------------------------

class PlayerInfo(TypedDict):
    playerID: str
    playerName: str


class BattleLog(TypedDict):
    Attacker: Factions
    AttackerRegion: GameLocation
    Defender: Factions
    AttackedRegion: GameLocation


class _BattleParticipantLogRequired(TypedDict):
    House: Factions
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
    currentGameStateReferenceIndex: int
    FiefdomTrackPosition: int
    ValyrianSteelBlade: int
    Total: int


class BattleParticipantLog(_BattleParticipantLogRequired, total=False):
    """Participant data for one side of a battle.

    Optional fields (may be absent in the JSON):
        OrderType: type of the order token played
        TidesOfBattleCard: tides of battle card used, if any
    """
    OrderType: str
    TidesOfBattleCard: Optional[str]


class CombatLog(TypedDict):
    BattleData: BattleLog
    LoserData: BattleParticipantLog
    WinnerData: BattleParticipantLog
    round: int


class WildingTrackData(TypedDict):
    Amount: int
    Faction: Factions
    Round: int


class UnitState(TypedDict):
    type: str
    house: Factions


class CleanHouseSnapshot(TypedDict):
    FactionName: Factions
    SupplyTier: int
    PowerTokens: int
    LandAreas: List[GameLocation]
    CastleCount: int
    LandAreaCount: int


class ExtractedRoundData(TypedDict):
    HouseSnapshotData: Dict[str, CleanHouseSnapshot]
    OrderTokenChoices: Dict[GameLocation, str]
    UnitLocationSnapshotData: Dict[GameLocation, List[UnitState]]
    Round: int
    LogIndex: int


class CleanBiddingData(TypedDict):
    Track: BidTracks
    Amount: int
    Faction: Factions
    Round: int
    currentGameStateReferenceIndex: int


# ---------------------------------------------------------------------------
# Top-level scraped entry and collection
# ---------------------------------------------------------------------------

class ScrapedGameEntry(TypedDict):
    """All data extracted for a single game instance.

    Mirrors the TypeScript intersection:
        PlayerExtraction & ExtractedMilitaryData & ExtractedBidData & ExtractedGameStateData
    """
    Players: List[PlayerInfo]
    combatLogs: List[CombatLog]
    TrackBids: List[CleanBiddingData]
    WildlingBids: List[WildingTrackData]
    Rounds: List[ExtractedRoundData]


# Keyed by game ID string — mirrors: type ScrapedData = { [key: string]: ... }
ScrapedData = Dict[str, ScrapedGameEntry]
