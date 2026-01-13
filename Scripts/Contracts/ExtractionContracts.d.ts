import { BidTracks, CleanBiddingData, CombatStats, Factions, GameClient, GameLogData } from "../../ScrapedData/GameTypes";

type IGameLogDataExtractor<T> = (log : GameLogData[]) => T & object

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
}

type ExtractedMilitaryData = {
  commonBattleStats: BattleStats[];
  combatLogs: CombatResultLog[];
  attackLogs: AttackLog[];
};

interface FactionStats {
  wins: number;
  losses: number;
  totalBattles: number;
  winRate: number;
  avgArmySize: number;
  avgEnemyArmy: number;
  commonHouseCards: Map<string, number>;
  regionVictories: Map<string, number>;
  regionLosses: Map<string, number>;
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

type CombatResultLog = GameLogData & { type: "combat-result"; winner: string; stats: CombatStats[] };
type AttackLog = GameLogData & { type: "attack"; attacker: string; attackingRegion: string; attackedRegion: string };

type WildingTrackData = {Amount : number, Faction : Factions}

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