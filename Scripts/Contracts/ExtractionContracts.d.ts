import { GameLogData } from "../../ScrapedData/GameTypes";

type IGameDataExtractor<T> = (log : GameLogData[]) => T & object