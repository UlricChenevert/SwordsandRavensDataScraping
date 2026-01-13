import { CombatResultLog, ProvinceStats, ArmyComposition, FactionStats } from "../Contracts/ExtractionContracts";
export declare const analyzeBattleAreas: (combatLogs: CombatResultLog[]) => Map<string, number>;
export declare const analyzeBattleStrategies: (combatLogs: CombatResultLog[]) => Map<string, {
    aggressive: number;
    decisive: number;
    passive: number;
}>;
export declare const analyzeProvinceDistributions: (combatLogs: CombatResultLog[]) => Map<string, ProvinceStats>;
export declare const analyzeProvinceControl: (combatLogs: CombatResultLog[]) => Map<string, Map<string, number>>;
export declare const analyzeArmyComposition: (combatLogs: CombatResultLog[]) => ArmyComposition[];
export declare const analyzeProvinceCountTimeline: (combatLogs: CombatResultLog[]) => Array<{
    timestamp: number;
    faction: string;
    count: number;
}>;
export declare const analyzeFactionStats: (combatLogs: CombatResultLog[]) => Map<string, FactionStats>;
//# sourceMappingURL=MiltaryAnalysis.d.ts.map