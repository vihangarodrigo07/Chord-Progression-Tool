# app/theory/melody.py
from typing import List, Dict

__all__ = ["dijkstra_melody"]

def _scale_notes(scale_type: str) -> List[str]:
    scales = {
        "major":      ["C","D","E","F","G","A","B"],
        "minor":      ["C","D","Eb","F","G","Ab","Bb"],
        "dorian":     ["C","D","Eb","F","G","A","Bb"],
        "mixolydian": ["C","D","E","F","G","A","Bb"],
    }
    return scales.get(scale_type, scales["major"])

def dijkstra_melody(start_note: str, end_note: str, scale_type: str) -> List[str]:
    scale = _scale_notes(scale_type)
    idx: Dict[str, int] = {n: i for i, n in enumerate(scale)}
    if start_note not in idx or end_note not in idx:
        return [start_note, end_note]

    # init
    dist: Dict[str, float] = {n: float("inf") for n in scale}
    prev: Dict[str, str] = {}
    unvis = set(scale)
    dist[start_note] = 0.0

    while unvis:
        cur = min(unvis, key=lambda n: dist[n])
        if cur == end_note:
            break
        unvis.remove(cur)

        for n in list(unvis):
            step = abs(idx[n] - idx[cur])
            w = 1.0 if step == 1 else 1.5 if step == 2 else 3.0
            alt = dist[cur] + w
            if alt < dist[n]:
                dist[n] = alt
                prev[n] = cur

    # reconstruct path
    path = [end_note]
    while path[0] in prev:
        path.insert(0, prev[path[0]])
    if path[0] != start_note:
        path.insert(0, start_note)
    return path
