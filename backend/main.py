from fastapi import FastAPI
from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from dotenv import load_dotenv
import speech_recognition as sr
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import pyttsx3
load_dotenv()
app = FastAPI()
origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
llm=HuggingFaceEndpoint(
    repo_id="mistralai/Mistral-7B-Instruct-v0.2",    
    task="text-generation",
    huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_ACCESS_TOKEN")
)

model = ChatHuggingFace(llm=llm)

class Question(BaseModel):
    text: str

@app.post("/chat")
def chat(q: Question):
    res = model.invoke(q.text)
    return {"response": res.content}