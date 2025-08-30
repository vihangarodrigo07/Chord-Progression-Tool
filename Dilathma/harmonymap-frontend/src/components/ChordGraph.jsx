import { useLayoutEffect, useMemo, useRef, useState } from "react";

export default function ChordGraph({ graph, highlight = [], height = 420, onPick }) {
  const wrapRef = useRef(null);
  const [size, setSize] = useState({ w: 600, h: height });

  useLayoutEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      setSize({ w: wrapRef.current.clientWidth, h: height });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [height]);

  const nodes = graph?.nodes ?? [];
  const edges = graph?.edges ?? [];

  const pos = useMemo(() => {
    const map = {};
    const R = Math.min(size.w, size.h) * 0.35;
    const cx = size.w / 2;
    const cy = size.h / 2;
    nodes.forEach((n, i) => {
      const ang = (i * 2 * Math.PI) / nodes.length - Math.PI / 2;
      map[n.name] = { x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
    });
    return map;
  }, [nodes, size]);

  const highlightSet = useMemo(() => {
    const s = new Set();
    for (let i = 0; i < highlight.length - 1; i++) s.add(`${highlight[i]}->${highlight[i + 1]}`);
    return s;
  }, [highlight]);

  return (
    <div
      ref={wrapRef}
      style={{
        height,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 12,
        marginTop: 8,
      }}
    >
      <svg width="100%" height="100%">
        <defs>
          <linearGradient id="chordGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>

        {edges
          .filter((e) => e.weight <= 2)
          .map((e, i) => {
            const a = pos[e.from],
              b = pos[e.to];
            if (!a || !b) return null;
            const key = `${e.from}->${e.to}`;
            const onPath = highlightSet.has(key);
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={onPath ? "#667eea" : "rgba(255,255,255,0.28)"}
                strokeWidth={onPath ? 3.5 : e.weight === 1 ? 2 : 1.5}
                style={onPath ? { filter: "drop-shadow(0 0 6px #667eea)" } : {}}
              />
            );
          })}

        {nodes.map((n) => {
          const p = pos[n.name];
          return (
            <g
              key={n.name}
              onClick={() => onPick && onPick(n.name)}
              style={{ cursor: onPick ? "pointer" : "default" }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={26}
                fill="url(#chordGrad)"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={p.y}
                fill="#fff"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {n.name}
              </text>
              <title>{`${n.fullName} (${n.func}) — click to pick`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
