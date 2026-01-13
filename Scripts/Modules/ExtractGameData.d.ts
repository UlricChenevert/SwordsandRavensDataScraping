import { GameClient, GameLog } from "../../ScrapedData/GameTypes";
import { IGameDataExtractor, IGameLogDataExtractor } from "../Contracts/ExtractionContracts";
export declare const extractGameData: (GameClient: GameClient) => {};
export declare const extractLogData: (logs: GameLog[], Extractors: IGameLogDataExtractor<object>[]) => {};
export declare const extractMiscData: (GameClient: GameClient, Extractors: IGameDataExtractor<object>[]) => {};
//# sourceMappingURL=ExtractGameData.d.ts.map