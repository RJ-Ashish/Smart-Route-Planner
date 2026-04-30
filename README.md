# Smart Route Planner (Greedy + Graph Algorithms)

Project showcasing Dijkstra, A* and Greedy pathfinding with interactive visualization.

## Overview

- Backend: Node.js + Express exposing `/route` POST endpoint that runs algorithms.
- Frontend: React + Vite with an interactive canvas visualization and controls.

## Algorithms

- `Dijkstra` — uses a min-heap priority queue; shows step-by-step relaxations.
- `A*` — heuristic-driven search (Euclidean when positions provided): f(n)=g(n)+h(n).
- `Greedy` — selects the lowest immediate-edge from current node (may be suboptimal).

## Project Structure

Smart-Route-Planner/
- frontend/ (React app)
- backend/ (Express server)
- algorithms/ (dijkstra.js, astar.js, greedy.js)
- data/sampleGraph.json

## Run locally

1. Backend

```bash
cd "Smart-Route-Planner/backend"
npm install
npm start
```

2. Frontend (in a separate terminal)

```bash
cd "Smart-Route-Planner/frontend"
npm install
npm run dev
```

Open the frontend URL (Vite will show) and the app will call the backend at `http://localhost:4000`.

## API

POST `/route`

Body:

```json
{
  "graph": {"A": {"B": 4}, "B": {}},
  "source": "A",
  "target": "B",
  "algorithm": "dijkstra|astar|greedy",
  "positions": {"A": {"x":0,"y":0}, "B": {"x":10,"y":0}} // optional for A*
}
```

Response includes `path`, `cost`, `visitedOrder`, `steps`, `timeMs`, and `nodesExplored`.

## Complexity Comparison (high level)

- Dijkstra: O((V+E) log V)
- A*: depends on heuristic, best-case close to O(n) with perfect heuristic
- Greedy: O(E) per run but may fail to find optimal path

## Notes

- The frontend includes a playback speed slider and shows visited nodes (yellow) and final path (green).
- You can modify `data/sampleGraph.json` and use the graph editor on the UI to test failure cases for Greedy.
