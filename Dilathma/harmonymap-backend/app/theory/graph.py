from typing import List, Dict, Tuple

Node = Dict[str, str]
Edge = Dict[str, object]

def build_chord_graph() -> Dict[str, object]:
    nodes: List[Node] = [
        {"name": "C",    "fullName": "C Major",      "func": "I"},
        {"name": "Dm",   "fullName": "D minor",      "func": "ii"},
        {"name": "Em",   "fullName": "E minor",      "func": "iii"},
        {"name": "F",    "fullName": "F Major",      "func": "IV"},
        {"name": "G",    "fullName": "G Major",      "func": "V"},
        {"name": "Am",   "fullName": "A minor",      "func": "vi"},
        {"name": "Bdim", "fullName": "B diminished", "func": "vii°"},
    ]

    edges_arr: List[Tuple[str, str, float]] = [
        ("C","F",1),("C","G",1),("C","Am",2),("C","Em",3),("C","Dm",3),
        ("F","C",1),("F","Dm",1),("F","G",2),("F","Am",2),("F","Bdim",3),
        ("G","C",1),("G","Em",1),("G","Am",2),("G","F",2),("G","Dm",3),
        ("Am","F",1),("Am","C",2),("Am","Dm",2),("Am","G",2),("Am","Em",3),
        ("Dm","G",1),("Dm","F",1),("Dm","Am",2),("Dm","Bdim",2),("Dm","C",3),
        ("Em","Am",1),("Em","C",3),("Em","G",1),("Em","F",3),("Em","Dm",3),
        ("Bdim","C",1),("Bdim","Em",2),("Bdim","G",2),("Bdim","Am",3),
    ]
    edges: List[Edge] = [{"from": a, "to": b, "weight": w} for a,b,w in edges_arr]

    # adjacency for algorithms
    adj: Dict[str, Dict[str, float]] = {n["name"]: {} for n in nodes}
    for e in edges:
        adj[e["from"]][e["to"]] = float(e["weight"])

    return {"nodes": nodes, "edges": edges, "adj": adj}
