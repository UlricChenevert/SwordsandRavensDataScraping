export var HouseCardState;
(function (HouseCardState) {
    HouseCardState[HouseCardState["AVAILABLE"] = 0] = "AVAILABLE";
    HouseCardState[HouseCardState["USED"] = 1] = "USED";
})(HouseCardState || (HouseCardState = {}));
export var PlayerActionType;
(function (PlayerActionType) {
    PlayerActionType[PlayerActionType["ORDERS_PLACED"] = 0] = "ORDERS_PLACED";
    PlayerActionType[PlayerActionType["BID_MADE"] = 1] = "BID_MADE";
    PlayerActionType[PlayerActionType["HOUSE_CARD_CHOSEN"] = 2] = "HOUSE_CARD_CHOSEN";
})(PlayerActionType || (PlayerActionType = {}));
export const tracksMapping = {
    0: "Iron Throne",
    1: "Fiefdom",
    2: "King's Court",
};
export var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["INITIALIZING"] = 0] = "INITIALIZING";
    ConnectionState[ConnectionState["CONNECTING"] = 1] = "CONNECTING";
    ConnectionState[ConnectionState["AUTHENTICATING"] = 2] = "AUTHENTICATING";
    ConnectionState[ConnectionState["SYNCED"] = 3] = "SYNCED";
    ConnectionState[ConnectionState["CLOSED"] = 4] = "CLOSED";
})(ConnectionState || (ConnectionState = {}));
export const defaultUserSettings = {
    chatHouseNames: false,
    mapScrollbar: false,
    muted: false,
    gameStateColumnRight: false,
    musicVolume: 0,
    notificationsVolume: 0,
    sfxVolume: 0,
};
//# sourceMappingURL=GameConstants.js.map