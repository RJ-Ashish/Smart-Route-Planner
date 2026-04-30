// Dijkstra's Algorithm implementation with min-heap
// Returns: {path, cost, visitedOrder, steps}

class MinHeap {
  constructor() { this.heap = [] }
  push(item) { this.heap.push(item); this._siftUp(this.heap.length-1) }
  pop() {
    if(!this.heap.length) return null
    const top = this.heap[0]
    const last = this.heap.pop()
    if(this.heap.length) { this.heap[0] = last; this._siftDown(0) }
    return top
  }
  _siftUp(i){
    while(i>0){
      const p = Math.floor((i-1)/2)
      if(this.heap[p][0] <= this.heap[i][0]) break
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]]
      i = p
    }
  }
  _siftDown(i){
    const n = this.heap.length
    while(true){
      let smallest = i
      const l = 2*i+1, r = 2*i+2
      if(l<n && this.heap[l][0] < this.heap[smallest][0]) smallest = l
      if(r<n && this.heap[r][0] < this.heap[smallest][0]) smallest = r
      if(smallest === i) break
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]]
      i = smallest
    }
  }
}

function dijkstra(graph, source, target) {
  const start = Date.now()
  const dist = {}
  const prev = {}
  const visited = new Set()
  const visitedOrder = []
  Object.keys(graph).forEach(n => { dist[n] = Infinity; prev[n] = null })
  if(!(source in graph) || !(target in graph)) return {error: 'source/target not in graph'}
  dist[source] = 0
  const heap = new MinHeap()
  heap.push([0, source])

  const steps = []
  while(true){
    const node = heap.pop()
    if(!node) break
    const [d,u] = node
    if(visited.has(u)) continue
    visited.add(u)
    visitedOrder.push(u)
    steps.push({type: 'visit', node: u, dist: d, distSnapshot: {...dist}})
    if(u === target) break
    const neighbors = graph[u] || {}
    for(const v of Object.keys(neighbors)){
      const w = neighbors[v]
      const alt = dist[u] + w
      if(alt < dist[v]){
        dist[v] = alt
        prev[v] = u
        heap.push([alt, v])
        steps.push({type: 'relax', from: u, to: v, newDist: alt})
      }
    }
  }

  const path = []
  let u = target
  if(prev[u] !== null || u === source){
    while(u){ path.unshift(u); u = prev[u] }
  }
  return {
    path,
    cost: dist[target] === Infinity ? null : dist[target],
    visitedOrder,
    steps,
    timeMs: Date.now() - start,
    nodesExplored: visitedOrder.length
  }
}

module.exports = dijkstra
