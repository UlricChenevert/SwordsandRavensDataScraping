from Framework.LoadJSONData import loadScrappedData
from Modules.Display import display_all
import asyncio


async def main():
    games = await loadScrappedData(-1)
    display_all(games)


asyncio.run(main())