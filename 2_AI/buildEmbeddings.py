import asyncio
from typing import List
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from Configuration.Constants import DB_PATH, EMBEDDINGS_MODEL_NAME

embeddingService = HuggingFaceEmbeddings(model_name=EMBEDDINGS_MODEL_NAME)
databaseService = Chroma(persist_directory=DB_PATH, embedding_function=embeddingService)

# def testDatabase():
#     results = databaseService.similarity_search("armies defeated", k=10, filter={"type": "combat_log"})

from Utilities.LoadJSONData import loadScrappedData
from Contracts.ExtractionContracts import PlayerInfo

def convertPlayerToPlainText(players: List[PlayerInfo]):
    final = "Players: "

    for player in players:
        final += player["playerName"] + " "

    return final

async def main():
    games = await loadScrappedData(2)

    documents = []

    for game in games:
        documentStrings : List[str] = []

        # Context part (whats going on in the world) Previous Bid tracks, house power tokens, etc; Players 
        documentStrings.append(convertPlayerToPlainText(game["Players"]))

        # Action part (whats going on right now) Bidding, combat
        documentStrings.append(convertPlayerToPlainText(game["Players"]))

        finalDocument = "\n".join(documentStrings)

        documents.append(finalDocument)
       
    databaseService.from_texts(documents, embeddingService)

asyncio.run(main())
