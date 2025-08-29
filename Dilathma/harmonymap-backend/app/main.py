from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

from .theory.graph import build_chord_graph
from .theory.progression import bfs_progression
from .theory.melody import dijkstra_melody

app = FastAPI(title="HarmonyMap API")

# Dev CORS for React (Vite default 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProgressionRequest(BaseModel):
    start: str
    end: str
    length: int = 4

class MelodyRequest(BaseModel):
    startNote: str
    endNote: str
    scaleType: str = "major"

@app.get("/api/health")
def health() -> Dict[str, Any]:
    return {"ok": True, "service": "HarmonyMap API (FastAPI)"}

@app.get("/api/graph")
def graph() -> Dict[str, Any]:
    g = build_chord_graph()
    return {"nodes": g["nodes"], "edges": g["edges"]}

@app.post("/api/progression")
def progression(req: ProgressionRequest) -> Dict[str, Any]:
    g = build_chord_graph()
    path = bfs_progression(g, req.start, req.end, req.length)
    roman_map = {n["name"]: n["func"] for n in g["nodes"]}
    roman = [roman_map.get(c, c) for c in path]
    return {"path": path, "roman": roman}

@app.post("/api/melody")
def melody(req: MelodyRequest) -> Dict[str, Any]:
    path = dijkstra_melody(req.startNote, req.endNote, req.scaleType)
    return {"path": path, "meta": {"scaleType": req.scaleType}}
