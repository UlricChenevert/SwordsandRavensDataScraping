import { BidTracks, CleanBiddingData, CombatStats, Factions, GameClient, GameLogData, House, IHouseSnapshot, IIronBankSnapshot } from "../../ScrapedData/GameTypes.js";

type IGameLogDataExtractor<T> = (log : GameLogData[], gameRoundMapping : LogIndexToGameRound[]) => T & object

type IGameDataExtractor<T> = (client : GameClient) => T & object

type PlayerExtraction = {Players : {playerID:string, playerName: string}[]}

type ScrapedData = {
  [key: string] : PlayerExtraction & ExtractedMilitaryData & ExtractedBidData
}



interface BattleStats {
  region: string;
  winner: string;
  loser: string;
  winnerArmy: number;
  loserArmy: number;
  winnerHouseCard: string | null;
  loserHouseCard: string | null;
  support: number;
  location: string;
  timestamp: number;
  round: number;
}

type ExtractedMilitaryData = {
  combatLogs: CombatLog[];
};

interface FactionStats {
  wins: number;
  losses: number;
  totalBattles: number;
  winRate: number;
  avgArmySize: number;
  avgEnemyArmy: number;
  winningHouseCards: Map<string, number>;
  regionVictories: Map<string, number>;
  regionLosses: Map<string, number>;
  winRateOverTime: Array<{ timestamp: number; winRate: number }>;
  gameWinningFaction: boolean;
}

interface ProvinceStats {
  contestedCount: number;
  winRate: Map<string, number>;
  criticality: "low" | "medium" | "high";
  avgLossImpact: number;
  controllingFactions: Map<string, number>;
}

interface ArmyComposition {
  timestamp: number;
  faction: string;
  units: string[];
  totalStrength: number;
}

type LogIndexToGameRound = {
  index: number, 
  round: number,
  wildlingStrength?: number;
  dragonStrength?: number;
  ironThroneTrack: Factions[];
  fiefdomsTrack: Factions[];
  kingsCourtTrack: Factions[];
  housesOnVictoryTrack: IHouseSnapshot[];
  vsbUsed?: boolean;
  ironBank?: IIronBankSnapshot;
}

type CombatLog = {
  BattleData : BattleLog
  LoserData : BattleParticipantLog
  WinnerData : BattleParticipantLog
  round : number
} 

type BattleLog = {
  Attacker : Factions
  AttackerRegion : string
  Defender : Factions
  AttackedRegion : string
}

type BattleParticipantLog = {
  House: Factions;

  OrderType? : string
  OrderBonus: number;

  ArmyStrength: number;
  ArmyUnits: string[];
  WoundedUnits: string[];

  SupportStrength: number;
  SupportingFactions : Factions[]
  RefusedSupport : boolean

  GarrisonStrength: number;
  
  HouseCard: string | null;
  HouseCardStrength: number;
  HouseCardSelection : string[]

  FiefdomTrackPosition : number
  
  ValyrianSteelBlade: number;

  TidesOfBattleCard: string | null | undefined;
  
  Total: number;
}

type AttackLog = GameLogData & { type: "attack"; attacker: string; attackingRegion: string; attackedRegion: string };

type WildingTrackData = {Amount : number, Faction : Factions, Round : number}

type ExtractedBidData = {
    TrackBids: CleanBiddingData[];
    WildlingBids: WildingTrackData[];
};

type BidAnalysisData = {
    "Iron Throne Distribution": { [key: number]: number };
    "Fiefdom Distribution": { [key: number]: number };
    "King's Court Distribution": { [key: number]: number };
    "Average Bid": number;
};