RAG_TEMPLATE = """
You are an expert at the official Game of Thrones Board Game.
Below are snippets from the official rulebook and the player's current situation. 

SOME RELEVANT RULES:
{rules}

SITUATION:
It is the {phase} phase.
{question}

At the end of your response, say exactly what you would do in this situation.
"""

ZERO_SHOT_TEMPLATE = """
You are an expert at the official Game of Thrones Board Game. Below is the player's current situation. 

SITUATION:
It is the {phase} phase.
{question}

At the end of your response, say exactly what you would do in this situation.
"""
DOCUMENT_RETRIEVAL_AMOUNT = 10

RULES_DB_PATH = "./game_rules_db"
TRACK_BID_DB_PATH = "./track_bid_db"
WILDLING_BID_DB_PATH = "./wildling_bid_db"
COMBAT_DB_PATH = "./combat_db"
EXTRACTED_DATA_PATH="../0_Extraction/Data"
RULES_DATA_PATH = "./2_AI/Data/rules.md"

EMBEDDINGS_MODEL_NAME = "models/gemini-embedding-001"

HOST_IP="127.0.0.1"

PORT=8000