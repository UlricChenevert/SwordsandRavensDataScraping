import { loadData, RemoveRedundantData } from './LoadData.js';
import { AnalyzeData } from './AnalysisEngine.js';
import { FactionBattleAnalyzer } from './ConfiguredAnalyzers.js';

AnalyzeData(
    RemoveRedundantData(
        await loadData()
    ), 
    [FactionBattleAnalyzer]
);

