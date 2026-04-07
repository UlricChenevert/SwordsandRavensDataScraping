from enum import Enum
from pydantic import BaseModel

class AIRetrievalType(Enum):
    ZERO_SHOT = "zero-shot"
    FEW_SHOT = "few-shot"
    RAG = "rag"

class AdviseRetrievalType(Enum):
    TRACK_BID = "track-bid"
    WILDING_BID = "wildling-bid"
    COMBAT = "combat"
    OTHER = "other"

class PromptRequest(BaseModel):
    geminiKey: str
    prompt: str
    context: str
    aiRetrievalType: AIRetrievalType
    adviseRetrievalType: AdviseRetrievalType