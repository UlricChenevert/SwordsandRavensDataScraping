import requests

url = "http://127.0.0.1:8000/"

params = {
    "query":"It is the first turn and I am playing as stark. How much should I bid on each track?",
    "aitype" : "rag",
    "phase" : "trackbid"
    }

from langchain_community.vectorstores import Chroma
from Configuration.Constants import WILDLING_BID_DB_PATH, TRACK_BID_DB_PATH, RULES_DB_PATH, COMBAT_DB_PATH, DOCUMENT_RETRIEVAL_AMOUNT
from dotenv import load_dotenv

from Services.EmbeddingsService import embeddings

load_dotenv()

ruleDBConnection = Chroma( persist_directory="game_rules_db", embedding_function=embeddings)
rrs = ruleDBConnection.as_retriever(search_kwargs={"k": DOCUMENT_RETRIEVAL_AMOUNT})
h = rrs.invoke(params["query"])

response = requests.get(url, params=params)
print(response.text)