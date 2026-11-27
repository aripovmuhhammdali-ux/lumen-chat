from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

app = FastAPI(title="Lumen Chat API")

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://lumen-chat-sqm6.onrender.com",
],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: list[dict]

@app.get("/")
async def home():
    return {
        "status": "online",
        "project": "Lumen Chat"
    }

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        async with httpx.AsyncClient(timeout=180) as client:
            response = await client.post(
                "http://127.0.0.1:11434/api/chat",
                json={
                    "model": "qwen3.5:2b",
                    "messages": request.messages,
                    "stream": False
                }
            )
            response.raise_for_status()
            result = response.json()

        return {
            "reply": result["message"]["content"]
        }

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Ollama is not running."
        )

    except httpx.HTTPError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error)
        )