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

from Configuration.Constants import HOST_IP, PORT, RAG_TEMPLATE

from Utilities.General import combineTextFragments

from Services.LLMService import llmService
from Services.DatabaseService import combatRetrieverService, ruleRetrieverService, wildlingBidRetrieverService, trackBidRetrieverService

app = FastAPI()

load_dotenv()


@app.get("/")
def home(query: str, aitype: str, phase: str):

    if aitype == "rag":
        promptTemplate = ChatPromptTemplate.from_template(RAG_TEMPLATE)
    else:
        promptTemplate = ChatPromptTemplate.from_template(RAG_TEMPLATE)
    
    template_phases = {
        "combat" : "Combat",
        "wildling" : "Wildling Bidding",
        "trackbid" : "Track Bid"
    }

    rules = combineTextFragments(ruleRetrieverService.invoke(query))
    prompt = promptTemplate.format_messages(rules=rules, question=query, phase=template_phases[phase])
    llm_response = llmService.invoke(prompt)

    return {"response": llm_response.content}

if __name__ == "__main__":
    '''
    query= "How much should I bid on each track on the first turn playing as stark?"
    promptTemplate = ChatPromptTemplate.from_template(RAG_TEMPLATE)
    rules = combineTextFragments(ruleRetrieverService.invoke(query))
    prompt = promptTemplate.format_messages(rules=rules, question=query)
    llm_response = llmService.invoke(prompt)
    '''
    
    uvicorn.run(app, host=HOST_IP, port=PORT)