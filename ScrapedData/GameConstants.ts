import { BidTracks } from "./GameTypes.js";

export const enum ReplacementReason {
  VOTE,
  CLOCK_TIMEOUT,
}

export enum HouseCardState {
    AVAILABLE,
    USED
}

export enum PlayerActionType {
  ORDERS_PLACED,
  BID_MADE,
  HOUSE_CARD_CHOSEN,
}

export const tracksMapping: { [key: number]: BidTracks } = {
    0: "Iron Throne",
    1: "Fiefdom",
    2: "King's Court",
};

export enum ConnectionState {
  INITIALIZING = 0,
  CONNECTING = 1,
  AUTHENTICATING = 2,
  SYNCED = 3,
  CLOSED = 4,
}


export const defaultUserSettings = {
  chatHouseNames: false,
  mapScrollbar: false,
  muted: false,
  gameStateColumnRight: false,
  musicVolume: 0,
  notificationsVolume: 0,
  sfxVolume: 0,
};

export type UserSettings = typeof defaultUserSettings;