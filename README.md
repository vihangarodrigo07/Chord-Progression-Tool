🎵 HarmonyMap – Chord Graph Visualizer
HarmonyMap is an intelligent music practice tool that models chords as nodes and harmonic relationships as edges using graph theory.
  🎹 Displays an interactive chord graph so musicians can explore harmonic movement visually.
  🔍 Supports progression generation (DFS/BFS) and melodic pathway finding (Dijkstra’s algorithm).
  🌐 Built with FastAPI backend + React frontend for real-time visualization and playback.

This helps students and improvisers (jazz, blues, modal harmony) practice chord changes and scales in a creative, structured way.

🚀 How to Run

Clone the repo
      git clone <repo-url>
      cd Chord-Progression-Tool

Run Backend (FastAPI)
      cd harmony-map-backend
      pip install -r requirements.txt
      uvicorn main:app --reload --port 8000
  Backend will start at 👉 http://localhost:8000

Run Frontend (React + Vite)
      cd harmonymap-frontend
      npm install
      npm run dev
  Frontend will start at 👉 http://localhost:5173
