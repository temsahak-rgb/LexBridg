"""LexBridge prototype API. No LLM calls, legal conclusions, or persistence."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
from uuid import uuid4
from pathlib import Path
import json

app = FastAPI(title="LexBridge API", version="0.2.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_credentials=False, allow_methods=["GET", "POST"], allow_headers=["*"])
ROOT = Path(__file__).resolve().parents[1]

class MatterIn(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    text: str = Field(min_length=10, max_length=30000)
    jurisdiction: str = Field(pattern=r"^[a-z]{2}$")
    language: Literal["en", "de", "fr"] = "en"
    kind: Literal["contract", "corporate", "compliance"] = "contract"

class MatterOut(BaseModel):
    id: str
    title: str
    status: str
    jurisdiction: str
    warnings: list[str]
    analysis: str

def get_manifests():
    return [json.loads(p.read_text(encoding="utf-8")) for p in sorted((ROOT / "jurisdictions").glob("*/manifest.json"))]

@app.get('/api/health')
def health():
    return {"ok": True, "ai_connected": False, "mode": "prototype; no document storage"}

@app.get('/api/jurisdictions')
def jurisdictions():
    return get_manifests()

@app.post('/api/matters', response_model=MatterOut)
def create_matter(matter: MatterIn):
    valid = {item["id"] for item in get_manifests()}
    if matter.jurisdiction not in valid:
        raise HTTPException(status_code=422, detail="Unknown jurisdiction")
    # Deliberately do not log, save or forward matter.text. No legal analysis.
    return MatterOut(id=str(uuid4()), title=matter.title, jurisdiction=matter.jurisdiction,
        status="awaiting-human-review", warnings=["No AI connected", "No legal source verified", "Do not use for legal decisions"],
        analysis="Prototype intake succeeded. No legal analysis was performed; your input was not persisted by this API.")
