from dotenv import load_dotenv
#from google import genai
from langchain_google_genai import ChatGoogleGenerativeAI
import uvicorn
from fastapi import FastAPI, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain


from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

from Configuration.Constants import GITHUB_ISSUES_URL, HOST_IP, PORT, TEMPLATE, USAGE_LIMIT

from Utilities.General import combineTextFragments

from Services.LLMService import llmService
from Services.DatabaseService import databaseRetrieverService
from Contracts.RequestContracts import PromptRequest 
from Contracts.ResponseContracts import GeneralResponse, PromptResponse, ResponseMetaData
import traceback

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) # type: ignore

load_dotenv()


@app.post("/")
@limiter.limit(USAGE_LIMIT)
def home(request: Request, body: PromptRequest) -> GeneralResponse[PromptResponse]:
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0, google_api_key=body.geminiKey)

        promptTemplate = ChatPromptTemplate.from_template(TEMPLATE)

        body.aiRetrievalType

        rag_chain = (
            {"context": databaseRetrieverService | combineTextFragments, "question": RunnablePassthrough()}
            | promptTemplate
            | llm.invoke
            | StrOutputParser()
        )

        response = rag_chain.invoke(body.prompt + body.context)

        return GeneralResponse(
            body=PromptResponse(reply=response, contextUsed=0),
            metadata=ResponseMetaData()
            )

    except Exception as e:
        print(f"An error occurred: {e}\n\n=====================================================\n\n")
        traceback.print_exc()

        return GeneralResponse(
            body=PromptResponse(reply="", contextUsed=0),
            metadata=ResponseMetaData(errorMessage=f"An error occurred. Please try again later, and please submit a issue at {GITHUB_ISSUES_URL}.")
            )

if __name__ == "__main__":
    #print(rag_chain.invoke("What do I do at the beginning of my turn?"))
    uvicorn.run(app, host=HOST_IP, port=PORT)