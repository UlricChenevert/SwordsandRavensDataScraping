from dotenv import load_dotenv
#from google import genai
import uvicorn
from fastapi import FastAPI

from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain


from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

from Configuration.Constants import HOST_IP, PORT, TEMPLATE

from Utilities.General import combineTextFragments

from Services.LLMService import llmService
from Services.DatabaseService import databaseRetrieverService

app = FastAPI()

load_dotenv()


@app.get("/")
def home(query: str):

    promptTemplate = ChatPromptTemplate.from_template(TEMPLATE)

    rag_chain = (
        {"context": databaseRetrieverService | combineTextFragments, "question": RunnablePassthrough()}
        | promptTemplate
        | llmService.invoke
        | StrOutputParser()
    )
        
    response = rag_chain.invoke(query)
    return {"response": response}

if __name__ == "__main__":
    #print(rag_chain.invoke("What do I do at the beginning of my turn?"))
    uvicorn.run(app, host=HOST_IP, port=PORT)