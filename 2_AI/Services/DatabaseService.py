from langchain_community.vectorstores import Chroma
from Configuration.Constants import WILDLING_BID_DB_PATH, TRACK_BID_DB_PATH, RULES_DB_PATH, COMBAT_DB_PATH, DOCUMENT_RETRIEVAL_AMOUNT
from dotenv import load_dotenv

from Services.EmbeddingsService import embeddings

load_dotenv()

ruleDBConnection = Chroma( persist_directory=RULES_DB_PATH, embedding_function=embeddings)
wildlingDBConnection = Chroma( persist_directory=WILDLING_BID_DB_PATH, embedding_function=embeddings)
trackDBConnection = Chroma( persist_directory=TRACK_BID_DB_PATH, embedding_function=embeddings)
combatDBConnection = Chroma( persist_directory=COMBAT_DB_PATH, embedding_function=embeddings)

ruleRetrieverService = ruleDBConnection.as_retriever(search_kwargs={"k": DOCUMENT_RETRIEVAL_AMOUNT})
wildlingBidRetrieverService = wildlingDBConnection.as_retriever(search_kwargs={"k": DOCUMENT_RETRIEVAL_AMOUNT})
trackBidRetrieverService = trackDBConnection.as_retriever(search_kwargs={"k": DOCUMENT_RETRIEVAL_AMOUNT})
combatRetrieverService = combatDBConnection.as_retriever(search_kwargs={"k": DOCUMENT_RETRIEVAL_AMOUNT})