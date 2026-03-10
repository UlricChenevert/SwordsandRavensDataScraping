import { BidTracks, Factions } from "./GameTypes.js";

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

export enum InfluenceTracks {
  "Iron Throne",
  "Fiefdom",
  "King's Court",
}

export enum ConnectionState {
  INITIALIZING = 0,
  CONNECTING = 1,
  AUTHENTICATING = 2,
  SYNCED = 3,
  CLOSED = 4,
}

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
] as const;

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
] as const;

export const possibleFactions : Factions[] = [
  "baratheon",
  "tyrell",
  "lannister",
  "arryn",
  "greyjoy",
  "targaryen",
  "martell",
  "stark"
] as const;

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


const modifyingGameLogTypes = new Set([
  "combat-result",
  "turn-begin",
  "march-resolved",
  "westeros-cards-drawn",
  "wildling-bidding",
  "player-mustered",
  "raven-holder-replace-order",
  "raid-done",
  "combat-valyrian-sword-used",
  "clash-of-kings-bidding-done",
  "clash-of-kings-final-ordering",
  "consolidate-power-order-resolved",
  "armies-reconciled",
  "patchface-used",
  "melisandre-dwd-used",
  "jon-snow-used",
  "doran-used",
  "ser-gerris-drinkwater-used",
  "reek-used",
  "reek-returned-ramsay",
  "lysa-arryn-mod-used",
  "qyburn-used",
  "aeron-damphair-used",
  "enemy-port-taken",
  "ships-destroyed-by-empty-castle",
  "preemptive-raid-units-killed",
  "preemptive-raid-track-reduced",
  "preemptive-raid-wildlings-attack",
  "massing-on-the-milkwater-house-cards-removed",
  "a-king-beyond-the-wall-lowest-reduce-tracks",
  "a-king-beyond-the-wall-house-reduce-track",
  "a-king-beyond-the-wall-highest-top-track",
  "mammoth-riders-destroy-units",
  "mammoth-riders-return-card",
  "the-horde-descends-units-killed",
  "crow-killers-knights-replaced",
  "crow-killers-knights-killed",
  "crow-killers-footman-upgraded",
  "skinchanger-scout-nights-watch-victory",
  "skinchanger-scout-wildling-victory",
  "rattleshirts-raiders-nights-watch-victory",
  "rattleshirts-raiders-wildling-victory",
  "game-of-thrones-power-tokens-gained",
  "supply-adjusted",
  "commander-power-token-gained",
  "beric-dondarrion-used",
  "varys-used",
  "jon-connington-used",
  "bronn-used",
  "house-card-picked",
  "littlefinger-power-tokens-gained",
  "alayne-stone-used",
  "lysa-arryn-ffc-power-tokens-gained",
  "anya-waynwood-power-tokens-gained",
  "robert-arryn-used",
  "house-card-removed-from-game",
  "viserys-targaryen-used",
  "illyrio-mopatis-power-tokens-gained",
  "daenerys-targaryen-b-power-tokens-discarded",
  "missandei-used",
  "power-tokens-gifted",
  "influence-track-position-chosen",
  "place-loyalty-choice",
  "loyalty-token-placed",
  "loyalty-token-gained",
  "fire-made-flesh-choice",
  "playing-with-fire-choice",
  "the-long-plan-choice",
  "move-loyalty-token-choice",
  "loan-purchased",
  "order-removed",
  "interest-paid",
  "debt-paid",
  "customs-officer-power-tokens-gained",
  "sellswords-placed",
  "the-faceless-men-units-destroyed",
  "pyromancer-executed",
  "expert-artificer-executed",
  "loyal-maester-executed",
  "master-at-arms-executed",
  "savvy-steward-executed",
  "special-objective-scored",
  "objective-scored",
  "ironborn-raid",
  "garrison-removed",
  "garrison-returned",
  "orders-revealed",
  "house-cards-returned",
  "leave-power-token-choice",
  "balon-greyjoy-asos-power-tokens-gained",
  "mace-tyrell-asos-order-placed",
  "bran-stark-used",
  "cersei-lannister-asos-power-tokens-discarded",
  "doran-martell-asos-used",
  "melisandre-of-asshai-power-tokens-gained",
  "salladhar-saan-asos-power-tokens-changed",
  "ser-ilyn-payne-asos-casualty-suffered",
  "stannis-baratheon-asos-used",
  "control-power-token-removed",
  "last-land-unit-transformed-to-dragon",
  "cersei-lannister-order-removed",
  "loras-tyrell-attack-order-moved",
  "mace-tyrell-footman-killed",
  "massing-on-the-milkwater-house-cards-back",
  "qarl-the-maid-tokens-gained",
  "queen-of-thorns-order-removed",
  "roose-bolton-house-cards-returned",
  "ser-ilyn-payne-footman-killed",
  "tywin-lannister-power-tokens-gained",
  "attack",
  "vassals-claimed",
  "claim-vassals-began",
]);

const relatedCombatResultTypes = new Set([
  "killed-after-combat",
  "immediatly-killed-after-combat",
  "retreat-region-chosen",
  "arianne-martell-prevent-movement",
  "arianne-martell-force-retreat",
  "retreat-casualties-suffered",
  "renly-baratheon-footman-upgraded-to-knight",
]);

const combatTerminationLogTypes = new Set([
  "attack",
  "march-resolved",
  "combat-result", // not really possible as "attack" must "preceed", but for safety...
  "action-phase-resolve-consolidate-power-began",
  "winner-declared",
  "turn-begin",
  "westeros-phase-began",
]);

const replacementLogTypes = new Set(["player-replaced", "vassal-replaced"]);

export class ReplayConstants {
  static modifyingGameLogTypes = modifyingGameLogTypes;
  static relatedCombatResultTypes = relatedCombatResultTypes;
  static combatTerminationLogTypes = combatTerminationLogTypes;
  static replacementLogTypes = replacementLogTypes;
}