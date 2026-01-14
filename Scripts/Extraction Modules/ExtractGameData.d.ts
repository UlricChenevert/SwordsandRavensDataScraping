import { GameClient, GameLog } from "../../ScrapedData/GameTypes.js";
import { LogIndexToGameRound, IGameDataExtractor, IGameLogDataExtractor } from "../Contracts/ExtractionContracts.js";
export declare const extractGameData: (GameClient: GameClient) => {};
export declare const extractLogData: (logs: GameLog[], Extractors: IGameLogDataExtractor<object>[], gameRoundToLogIndex: LogIndexToGameRound[]) => {};
export declare const extractGameTurnData: (logs: GameLog[]) => LogIndexToGameRound[];
export declare const extractMiscData: (GameClient: GameClient, Extractors: IGameDataExtractor<object>[]) => {};
//# sourceMappingURL=ExtractGameData.d.ts.map