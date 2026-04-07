from typing import Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class ResponseMetaData(BaseModel):
    errorMessage: Optional[str] = None


class GeneralResponse(BaseModel, Generic[T]):
    body: T
    metadata: ResponseMetaData


class PromptResponse(BaseModel):
    reply: str
    contextUsed: int
