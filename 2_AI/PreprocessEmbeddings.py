import asyncio
from typing import List
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from Configuration.Constants import RULES_DB_PATH, EMBEDDINGS_MODEL_NAME, RULES_DATA_PATH, WILDLING_BID_DB_PATH, TRACK_BID_DB_PATH, COMBAT_DB_PATH
from dotenv import load_dotenv
import time

batch_size = 100

load_dotenv()

embeddingService = GoogleGenerativeAIEmbeddings(model=EMBEDDINGS_MODEL_NAME)
rulesDatabaseService = Chroma(persist_directory=RULES_DB_PATH, embedding_function=embeddingService)
trackBidDatabaseService = Chroma(persist_directory=TRACK_BID_DB_PATH, embedding_function=embeddingService)
combatDatabaseService = Chroma(persist_directory=COMBAT_DB_PATH, embedding_function=embeddingService)
wildlingBidDatabaseService = Chroma(persist_directory=WILDLING_BID_DB_PATH, embedding_function=embeddingService)

# def testDatabase():
#     results = databaseService.similarity_search("armies defeated", k=10, filter={"type": "combat_log"})

from Utilities.LoadJSONData import loadScrappedData
from Utilities.ConvertExtractedJSONToString import buildContextForEvent, convertCombatToPlainText, convertPlayerToPlainText, convertSettingsToPlainText
from Utilities.ConvertExtractedJSONToString import convertTrackBidListToPlainText, convertWildlingBidListToPlainText
from Utilities.JoinJSONData import joinTrackBidsByRound, joinWildlingBidsByRound

async def main():
    games = await loadScrappedData(251)

    documents = []

    #Rules Conversion
    text = ""
    with open(RULES_DATA_PATH, encoding='utf-8', errors="replace") as file:
        text = file.read()

    splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=[("#", "Header 1"), ("##", "Header 2"), ("###", "Header 3")]
    )
    chunks = splitter.split_text(text)
    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        
        rulesDatabaseService.add_documents(batch)
        print(f"Sleeping 60s")
        
        #wait 60 seconds to let the rate limit reset
        time.sleep(60)

    # JSON Conversion
    batch_size = 51
    print("Combat Embeddings")
    for game in games:
        documentStrings : List[str] = []
        
        playerString = convertPlayerToPlainText(game["Players"])
        settingsString = convertSettingsToPlainText(game.get("Settings")) if not game.get("Settings") is None else "None found"

        for combatEvent in game["combatLogs"]:
            try:
                # Context part (whats going on in the world) Previous Bid tracks, house power tokens, etc; Players 
                context = buildContextForEvent(playerString, settingsString, combatEvent["CorrespondingTurnIndex"], game["GameID"], game["Rounds"])
            except Exception as e:
                print(e)
                continue
            # Action part (whats going on right now) Bidding, combat
            action = convertCombatToPlainText(combatEvent)

            text = f"Context\n {context} \nCombat {action}"

            documentStrings.append(text)
        
        finalDocument = "\n".join(documentStrings)

        documents.append(finalDocument)
    
    for i in range(0, len(documents), batch_size):
        batch = documents[i : i + batch_size]
        
        combatDatabaseService.add_texts(batch)
        print(f"Sleeping 60s")
        
        #wait 60 seconds to let the rate limit reset
        time.sleep(60)
    documents = []

    print("Track Bid Embeddings")
    for game in games:
        documentStrings : List[str] = []
        joinedBids = joinTrackBidsByRound(game["TrackBids"])

        playerString = convertPlayerToPlainText(game["Players"])
        settingsString = convertSettingsToPlainText(game.get("Settings")) if not game.get("Settings") is None else "None found"

        for roundID in joinedBids.keys():
            try:
                # Context part (whats going on in the world) Previous Bid tracks, house power tokens, etc; Players 
                context = buildContextForEvent(playerString, settingsString, roundID, game["GameID"], game["Rounds"])

            except Exception as e:
                print(e)
                continue

            biddingText = convertTrackBidListToPlainText(joinedBids[roundID])
            text = f"Context\n {context} \nBidding {biddingText}"
            documentStrings.append(text)
        
        finalDocument = "\n".join(documentStrings)

        documents.append(finalDocument)

    for i in range(0, len(documents), batch_size):
        batch = documents[i : i + batch_size]
        
        trackBidDatabaseService.add_texts(batch)
        print(f"Sleeping 60s")
        
        #wait 60 seconds to let the rate limit reset
        time.sleep(60)

    documents = []

    print("Wildling Bid Embeddings")
    for game in games:
        documentStrings : List[str] = []
        joinedBids = joinTrackBidsByRound(game["TrackBids"])

        playerString = convertPlayerToPlainText(game["Players"])
        settingsString = convertSettingsToPlainText(game.get("Settings")) if not game.get("Settings") is None else "None found"
        try:
            joinedBids = joinWildlingBidsByRound(game["WildlingBids"])
        except Exception as e:
            print(e)
            continue
        for roundID in joinedBids.keys():
            try:
                # Context part (whats going on in the world) Previous Bid tracks, house power tokens, etc; Players 
                context = buildContextForEvent(playerString, settingsString, roundID, game["GameID"], game["Rounds"])

            except Exception as e:
                print(e)
                continue

            biddingText = convertWildlingBidListToPlainText(joinedBids[roundID])
            text = f"Context\n {context} \nBidding {biddingText}"
            documentStrings.append(text)
        
        finalDocument = "\n".join(documentStrings)

        documents.append(finalDocument)
    
    for i in range(0, len(documents), batch_size):
        batch = documents[i : i + batch_size]
        
        wildlingBidDatabaseService.add_texts(batch)
        print(f"Sleeping 60s")
        
        #wait 60 seconds to let the rate limit reset
        time.sleep(60)
            
        
       

asyncio.run(main())
