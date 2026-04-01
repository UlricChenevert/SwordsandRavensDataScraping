import asyncio
from typing import List
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import MarkdownHeaderTextSplitter
from Configuration.Constants import DB_PATH, EMBEDDINGS_MODEL_NAME, RULES_DATA_PATH

embeddingService = HuggingFaceEmbeddings(model_name=EMBEDDINGS_MODEL_NAME)
databaseService = Chroma(persist_directory=DB_PATH, embedding_function=embeddingService)

# def testDatabase():
#     results = databaseService.similarity_search("armies defeated", k=10, filter={"type": "combat_log"})

from Utilities.LoadJSONData import loadScrappedData
from Utilities.ConvertExtractedJSONToString import buildContextForEvent, convertCombatToPlainText, convertPlayerToPlainText, convertSettingsToPlainText

async def main():
    games = await loadScrappedData(10)

    documents = []

    #Rules Conversion
    text = ""
    with open(RULES_DATA_PATH, encoding='utf-8', errors="replace") as file:
        text = file.read()

    splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=[("#", "Header 1"), ("##", "Header 2"), ("###", "Header 3")]
    )
    chunks = splitter.split_text(text)

    # JSON Conversion
    for game in games:
        documentStrings : List[str] = []
        
        playerString = convertPlayerToPlainText(game["Players"])
        settingsString = convertSettingsToPlainText(game.get("Settings")) if not game.get("Settings") is None else "None found"

        for combatEvent in game["combatLogs"]:
            # Context part (whats going on in the world) Previous Bid tracks, house power tokens, etc; Players 
            context = buildContextForEvent(playerString, settingsString, combatEvent["CorrespondingTurnIndex"], game["GameID"], game["Rounds"])

            # Action part (whats going on right now) Bidding, combat
            action = convertCombatToPlainText(combatEvent)

            text = f"Context\n {context} \nCombat {action}"

            documentStrings.append(text)


        # for trackBidEvent in game["combatLogs"]:


        # for wildingBidEvent in game["combatLogs"]:
            
        finalDocument = "\n".join(documentStrings)

        documents.append(finalDocument)
       
    databaseService.from_texts(documents)
    databaseService.add_documents(chunks)

asyncio.run(main())
