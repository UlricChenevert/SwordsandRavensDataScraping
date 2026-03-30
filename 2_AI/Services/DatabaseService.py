from langchain_community.vectorstores import Chroma
from Configuration.Constants import DB_PATH, DOCUMENT_RETRIEVAL_AMOUNT

from EmbeddingsService import embeddings

chromaDatabaseConnection = Chroma(
    persist_directory=DB_PATH, 
    embedding_function=embeddings
)

databaseRetrieverService = chromaDatabaseConnection.as_retriever(search_kwargs={"k": DOCUMENT_RETRIEVAL_AMOUNT})