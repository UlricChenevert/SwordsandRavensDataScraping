import aiofiles
import json
import asyncio
from pathlib import Path
from Contracts.ExtractionContracts import ScrapedData, ScrapedGameEntry

ScrappedDataDirectory = Path("0_Extraction/Data/")
ScrappedReportDirectory = Path("Data/")

def convertJSONToScrappedData(fileString: str) -> ScrapedData:
    return json.loads(fileString)


def RemoveRedundantData(data: list[ScrapedData]) -> list[ScrapedGameEntry]:
    usedKeys: set[str] = set()
    uniqueData: list[ScrapedGameEntry] = []

    for scrappedData in data:
        for key in scrappedData.keys():
            if key not in usedKeys:
                usedKeys.add(key)
                uniqueData.append(scrappedData[key])

    return uniqueData


async def read_files_async(file_path: str) -> str:
    async with aiofiles.open(file_path, mode='r') as file:
        return await file.read()


async def loadScrappedData(amount: int = 2) -> list[ScrapedGameEntry]:
    filePaths = list(ScrappedDataDirectory.iterdir())

    if (amount != -1): filePaths = filePaths[:amount]

    rawStrings = await asyncio.gather(*[read_files_async(str(fp)) for fp in filePaths])
    parsedData = [convertJSONToScrappedData(s) for s in rawStrings]

    return RemoveRedundantData(parsedData)


def storeReport():
    pass
