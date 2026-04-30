// A* implementation. Accepts optional positions object for heuristic.
const dijkstraBase = require('./dijkstra')

function euclidean(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function astar(graph, source, target, positions = {}){
  const start = Date.now()
  if(!(source in graph) || !(target in graph)) return {error: 'source/target not in graph'}

  const open = new Map()
  const g = {}
  const f = {}
  const prev = {}
  const visitedOrder = []
  Object.keys(graph).forEach(n => { g[n] = Infinity; f[n] = Infinity; prev[n] = null })
  g[source] = 0
  const h = (n) => {
    if(positions && positions[n] && positions[target]) return euclidean(positions[n], positions[target])
    return 0
  }
  f[source] = h(source)
  open.set(source, f[source])
  const steps = []

  while(open.size){
    // pick node in open with smallest f
    let current = null, best = Infinity
    for(const [n,val] of open) if(val < best){ best = val; current = n }
    open.delete(current)
    visitedOrder.push(current)
    steps.push({type: 'visit', node: current, f: f[current], g: g[current]})
    if(current === target) break
    for(const nb of Object.keys(graph[current] || {})){
      const w = graph[current][nb]
      const tentative = g[current] + w
      if(tentative < g[nb]){
        prev[nb] = current
        g[nb] = tentative
        f[nb] = tentative + h(nb)
        open.set(nb, f[nb])
        steps.push({type: 'relax', from: current, to: nb, newG: g[nb], f: f[nb]})
      }
    }
  }

  const path = []
  let u = target
  if(prev[u] !== null || u===source){ while(u){ path.unshift(u); u = prev[u] } }
  return {
    path,
    cost: g[target] === Infinity ? null : g[target],
    visitedOrder,
    steps,
    timeMs: Date.now() - start,
    nodesExplored: visitedOrder.length
  }
}

module.exports = astar
