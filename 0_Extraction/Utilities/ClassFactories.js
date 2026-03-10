import { possibleFactions } from "../Contracts/GameConstants.js";
export const CleanHouseSnapshotFactory = (HouseName) => {
    return {
        FactionName: HouseName,
        SupplyTier: -1,
        PowerTokens: -1,
        LandAreas: [],
        RoundEndCastleCount: -1,
        LandAreaCount: -1
    };
};
export const ExtractedRoundDataFactory = () => {
    const HouseSnapshots = {};
    possibleFactions.forEach(house => {
        HouseSnapshots[house] = CleanHouseSnapshotFactory(house);
    });
    return {
        HouseSnapshotData: HouseSnapshots,
        IronThroneTrack: [],
        FiefdomTrack: [],
        KingsCourtThroneTrack: [],
        OrderTokenChoices: {},
        UnitLocationSnapshotData: {},
        Round: -1,
        LogIndex: -1
    };
};
