TEMPLATE = """
You are an expert at a board game called Sword and Ravens. Below are snippets from the official rulebook
and the player's current situation. 

{context}

SITUATION:
{question}

Based on the rules provided above, what is the best move?
"""
DOCUMENT_RETRIEVAL_AMOUNT = 5

DB_PATH = "./game_rules_db"
EXTRACTED_DATA_PATH="../0_Extraction/Data"
RULES_DATA_PATH = "./2_AI/Data/rules.md"

EMBEDDINGS_MODEL_NAME = "all-mpnet-base-v2"

HOST_IP="127.0.0.1"

GITHUB_ISSUES_URL = "https://github.com/UlricChenevert/SwordsandRavensAIAssistant/issues"

PORT=5002

USAGE_LIMIT = "10/minute"