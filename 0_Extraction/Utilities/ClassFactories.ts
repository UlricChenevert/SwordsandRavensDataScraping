import { possibleFactions } from "../Contracts/GameConstants.js"
import { Factions, GameLocation, UnitState } from "../Contracts/GameTypes.js"
import { CleanHouseSnapshot, ExtractedRoundData } from "../Contracts/Contracts.js"

export const CleanHouseSnapshotFactory = (HouseName : Factions) : CleanHouseSnapshot => {
    return {
        FactionName : HouseName,
        SupplyTier: -1,
        PowerTokens: -1,
        LandAreas : [],
        RoundEndCastleCount: -1,
        LandAreaCount: -1
    }
}

export const ExtractedRoundDataFactory = () : ExtractedRoundData => {
    const HouseSnapshots = {} as Record<Factions, CleanHouseSnapshot>
    
    possibleFactions.forEach(house=>{
        HouseSnapshots[house] = CleanHouseSnapshotFactory(house)
    })

    return {
        HouseSnapshotData: HouseSnapshots,
        IronThroneTrack : [],
        FiefdomTrack : [],
        KingsCourtThroneTrack : [],
        OrderTokenChoices: {},
        UnitLocationSnapshotData: {},
        Round : -1,
        LogIndex : -1
    }
}