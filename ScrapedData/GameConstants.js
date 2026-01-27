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
export const possibleLocations = [
    "blackwater", "kings-landing", "the-reach", "kingswood", "blackwater-bay",
    "crackclaw-point", "harrenhal", "stoney-sept", "riverrun", "lannisport",
    "pyke", "ironmans-bay", "the-golden-sound", "port-of-pyke", "port-of-lannisport",
    "seagard", "sunset-sea", "flints-finger", "greywater-watch", "searoad-marches",
    "bay-of-ice", "castle-black", "karhold", "winterfell", "port-of-winterfell",
    "the-stony-shore", "white-harbor", "widows-watch", "the-shivering-sea", "moat-cailin",
    "port-of-white-harbor", "the-narrow-sea", "the-fingers", "the-twins", "the-vale-of-arryn",
    "the-eyrie", "shipbreaker-bay", "dragonstone", "port-of-dragonstone", "port-of-sunspear",
    "sunspear", "sea-of-dorne", "east-summer-sea", "salt-shore", "storms-end",
    "port-of-storms-end", "the-boneway", "princes-pass", "yronwood", "three-towers",
    "starfall", "the-arbor", "west-summer-sea", "redwyne-straights", "port-of-oldtown",
    "oldtown", "highgarden", "dornish-marches", "the-mountains-of-the-moon", "the-bite",
    "port-of-the-eyrie", "braavosian-coastlands", "bay-of-pentos", "sea-of-myrth", "the-orange-shore",
    "the-disputed-lands", "myr", "the-rhoyne", "norvos", "volantis",
    "braavos", "pentos", "port-of-braavos", "port-of-pentos", "port-of-volantis"
];
export const possibleHouseCards = [
    "stannis-baratheon-dwd", "renly-baratheon-asos", "salladhor-saan", "patchface",
    "ser-davos-seaworth", "ser-davos-seaworth-dwd", "melisandre-dwd", "eddard-stark",
    "ramsay-bolton", "reek", "roose-bolton", "eddard-stark-asos", "the-blackfish",
    "catelyn-stark-asos", "quentyn-martell", "the-red-viper", "nymeria-sand-asos",
    "maester-caleotte", "doran-martell-asos", "darkstar-asos", "arianne-martell",
    "victarion-greyjoy", "euron-crows-eye", "aeron-damphair", "victarion-greyjoy-asos",
    "balon-greyjoy-nerfed", "dagmar-cleftjaw", "theon-greyjoy", "ser-loras-tyrell",
    "queen-of-thorns-asos", "mace-tyrell", "ser-garlan-tyrell", "queen-of-thorns-dwd",
    "mace-tyrell-asos", "willas-tyrell-asos", "lysa-arryn-ffc", "godric-borrell",
    "lothor-brune", "bronze-yohn-royce-mod", "bronze-yohn-royce-ffc", "nestor-royce",
    "lyn-corbray", "daenerys-targaryen-b", "arstan-whitebeard", "missandei",
    "xaro-xhoan-daxos", "ser-jorah-mormont", "daenerys-targaryen-a", "varys",
    "syrio-forel", "jaqen-h-ghar", "janos-slynt", "jon-connington", "beric-dondarrion",
    "bronn", "viserys-targaryen", "qyburn", "ser-ilyn-payne", "tyrion-lannister",
    "ser-gregor-clegane", "ser-jaime-lannister-dwd", "the-hound", "ser-addam-marbrand"
];
export const possibleFactions = [
    "baratheon",
    "tyrell",
    "lannister",
    "arryn",
    "greyjoy",
    "targaryen",
    "martell",
    "stark"
];
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