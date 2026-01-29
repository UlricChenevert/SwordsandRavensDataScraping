import { loadAnalyzedData, loadScrappedData, RemoveRedundantData, storeData } from './LoadAndStoreData.js';
import { AnalyzeData } from './AnalysisEngine.js';
import { BidAnalyzer, CardChoiceAnalyzer, FactionBattleAnalyzer } from './ConfiguredAnalyzers.js';
storeData(AnalyzeData(RemoveRedundantData(await loadScrappedData()), [FactionBattleAnalyzer, BidAnalyzer, CardChoiceAnalyzer], await loadAnalyzedData()));
//# sourceMappingURL=AnalysisScript.js.map