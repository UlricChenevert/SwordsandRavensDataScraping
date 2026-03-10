import { Factions, GameLocation, UnitState } from "./GameTypes.js";

type CleanHouseSnapshot = {
    FactionName : Factions
    SupplyTier: number;
    PowerTokens: number;
    LandAreas : GameLocation[]
    RoundEndCastleCount: number;
    LandAreaCount: number;
}

type ExtractedRoundData = {
    HouseSnapshotData: Record<Factions, CleanHouseSnapshot>;
    OrderTokenChoices: Partial<Record<GameLocation, string>>;
    UnitLocationSnapshotData: Partial<Record<GameLocation, UnitState[]>>
    
    IronThroneTrack : Factions[]
    FiefdomTrack : Factions[],
    KingsCourtThroneTrack : Factions[],
    
    LogIndex : number,
    Round : number
};

type ExtractedGameStateData = {
    Rounds : ExtractedRoundData[]
    InErrorGame : boolean
}