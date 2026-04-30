// Greedy algorithm: always pick smallest immediate edge (not optimal)
function greedy(graph, source, target){
  const start = Date.now()
  if(!(source in graph) || !(target in graph)) return {error: 'source/target not in graph'}
  const visited = new Set()
  const visitedOrder = []
  const path = [source]
  let current = source
  visited.add(current)
  visitedOrder.push(current)
  const steps = []

  while(current !== target){
    const neighbors = graph[current] || {}
    let next = null, bestW = Infinity
    for(const v of Object.keys(neighbors)){
      if(visited.has(v)) continue
      const w = neighbors[v]
      if(w < bestW){ bestW = w; next = v }
    }
    if(!next) break
    steps.push({type:'choose', from: current, to: next, weight: bestW})
    current = next
    path.push(current)
    visited.add(current)
    visitedOrder.push(current)
    // stop if stuck in loop (safety)
    if(path.length > Object.keys(graph).length + 5) break
  }

  // compute cost
  let cost = 0
  for(let i=0;i<path.length-1;i++){
    const a = path[i], b = path[i+1]
    cost += graph[a] && graph[a][b] ? graph[a][b] : Infinity
  }

  return {
    path,
    cost: cost === Infinity ? null : cost,
    visitedOrder,
    steps,
    timeMs: Date.now() - start,
    nodesExplored: visitedOrder.length
  }
}

module.exports = greedy
