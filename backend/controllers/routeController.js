const path = require('path')
const dijkstra = require(path.join(__dirname, '../../algorithms/dijkstra'))
const astar = require(path.join(__dirname, '../../algorithms/astar'))
const greedy = require(path.join(__dirname, '../../algorithms/greedy'))

async function handleRoute(req, res){
  try{
    const { graph, source, target, algorithm, positions } = req.body
    if(!graph || !source || !target || !algorithm) return res.status(400).json({error:'missing fields'})
    let result
    if(algorithm === 'dijkstra') result = dijkstra(graph, source, target)
    else if(algorithm === 'astar') result = astar(graph, source, target, positions)
    else if(algorithm === 'greedy') result = greedy(graph, source, target)
    else return res.status(400).json({error:'unknown algorithm'})
    return res.json({algorithm, graphSummary: {nodes: Object.keys(graph).length}, ...result})
  }catch(err){
    console.error(err)
    res.status(500).json({error: err.message})
  }
}

module.exports = { handleRoute }
