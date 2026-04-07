from dotenv import load_dotenv
#from google import genai
from langchain_google_genai import ChatGoogleGenerativeAI
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain


from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import ChatPromptTemplate

from langchain_core.output_parsers import StrOutputParser
from operator import itemgetter

from Configuration.Constants import GITHUB_ISSUES_URL, HOST_IP, PORT, RAG_TEMPLATE, USAGE_LIMIT, ZERO_SHOT_TEMPLATE

from Utilities.General import combineTextFragments
from Utilities.ConvertExtractedJSONToString import (
    convertRoundToPlainText,
    convertPlayerToPlainText,
    convertTrackBidListToPlainText,
    convertWildlingBidListToPlainText,
    convertCombatToPlainText,
)
from Contracts.RequestContracts import AIRetrievalType, GameContext

def buildGameStateString(context: GameContext) -> str:
    parts = [
        f"Players: {convertPlayerToPlainText(context.players)}",
        convertRoundToPlainText(context.gameState),
    ]
    if context.trackBids:
        parts.append(f"Track Bids:\n{convertTrackBidListToPlainText(context.trackBids)}")
    if context.wildlingBids:
        parts.append(f"Wildling Bids:\n{convertWildlingBidListToPlainText(context.wildlingBids)}")
    if context.combat:
        parts.append(f"Last Combat:\n{convertCombatToPlainText(context.combat)}")
    return "\n\n".join(parts)

from Services.LLMService import llmService
from Services.DatabaseService import combatRetrieverService, ruleRetrieverService, wildlingBidRetrieverService, trackBidRetrieverService
from Contracts.RequestContracts import PromptRequest 
from Contracts.ResponseContracts import GeneralResponse, PromptResponse, ResponseMetaData
import traceback

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) # type: ignore
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["POST"], allow_headers=["Content-Type"])

load_dotenv()


@app.post("/")
@limiter.limit(USAGE_LIMIT)
def home(request: Request, body: PromptRequest) -> GeneralResponse[PromptResponse]:
    try:
        llm = ChatGoogleGenerativeAI(model=body.model, temperature=0, google_api_key=body.geminiKey, max_retries=0)
        
        if body.aiRetrievalType == AIRetrievalType.RAG:
            promptTemplate = ChatPromptTemplate.from_template(RAG_TEMPLATE)
        else:
            promptTemplate = ChatPromptTemplate.from_template(ZERO_SHOT_TEMPLATE)

        

        rag_chain = (
            {
                "context": itemgetter("question") | ruleRetrieverService | combineTextFragments,
                "game_state": itemgetter("game_state"),
                "question": itemgetter("question")
            }
            | promptTemplate
            | llm.invoke
            | StrOutputParser()
        )

        response = rag_chain.invoke({
            "question": body.prompt,
            "game_state": buildGameStateString(body.context) if body.context else "No game state provided."
        })

        return GeneralResponse(
            body=PromptResponse(reply=response, contextUsed=0),
            metadata=ResponseMetaData()
            )

    except Exception as e:
        print(f"An error occurred: {e}\n\n=====================================================\n\n")
        traceback.print_exc()

        error_str = str(e)
        if "API_KEY_INVALID" in error_str or "API key not valid" in error_str:
            error_message = "Invalid Gemini API key. Please check your key and try again."
        elif "PERMISSION_DENIED" in error_str:
            error_message = "Gemini API key does not have permission to use this model."
        elif "RESOURCE_EXHAUSTED" in error_str or "quota" in error_str.lower():
            error_message = "Gemini API quota exceeded. Please try again later."
        else:
            error_message = f"An error occurred. Please try again later, and please submit an issue at {GITHUB_ISSUES_URL}."

        return GeneralResponse(
            body=PromptResponse(reply="", contextUsed=0),
            metadata=ResponseMetaData(InError=True, errorMessage=error_message)
            )

if __name__ == "__main__":
    '''
    query= "How much should I bid on each track on the first turn playing as stark?"
    promptTemplate = ChatPromptTemplate.from_template(RAG_TEMPLATE)
    rules = combineTextFragments(ruleRetrieverService.invoke(query))
    prompt = promptTemplate.format_messages(rules=rules, question=query)
    llm_response = llmService.invoke(prompt)
    '''
    
    uvicorn.run(app, host=HOST_IP, port=PORT)