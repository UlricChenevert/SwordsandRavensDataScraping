import { BidTracks } from "./GameTypes.js";
export declare const enum ReplacementReason {
    VOTE = 0,
    CLOCK_TIMEOUT = 1
}
export declare enum HouseCardState {
    AVAILABLE = 0,
    USED = 1
}
export declare enum PlayerActionType {
    ORDERS_PLACED = 0,
    BID_MADE = 1,
    HOUSE_CARD_CHOSEN = 2
}
export declare const tracksMapping: {
    [key: number]: BidTracks;
};
export declare enum ConnectionState {
    INITIALIZING = 0,
    CONNECTING = 1,
    AUTHENTICATING = 2,
    SYNCED = 3,
    CLOSED = 4
}
export declare const defaultUserSettings: {
    chatHouseNames: boolean;
    mapScrollbar: boolean;
    muted: boolean;
    gameStateColumnRight: boolean;
    musicVolume: number;
    notificationsVolume: number;
    sfxVolume: number;
};
export type UserSettings = typeof defaultUserSettings;
//# sourceMappingURL=GameConstants.d.ts.map