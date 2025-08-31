from typing import List, Dict

def bfs_progression(graph: Dict, start: str, end: str, length: int) -> List[str]:
    adj: Dict[str, Dict[str, float]] = graph["adj"]
    if start not in adj or end not in adj:
        raise ValueError("Invalid start or end chord")
    if length < 2:
        return [start, end]

    from collections import deque
    q = deque([[start]])

    while q:
        path = q.popleft()
        last = path[-1]

        if len(path) == length - 1:
            return path + [end]

        # neighbors by weight (ascending), limit to top 3
        neighs = sorted(adj[last].items(), key=lambda kv: kv[1])
        for n, _w in neighs[:3]:
            if n not in path or len(path) > 2:
                q.append(path + [n])

    # fallback: simple walk
    out = [start]
    cur = start
    for _ in range(1, length - 1):
        options = list(adj[cur].keys()) or list(adj.keys())
        cur = options[0]
        out.append(cur)
    out.append(end)
    return out
