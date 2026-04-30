import axios from 'axios'

export async function computeRoute(graph, source, target, algorithm){
  const res = await axios.post('http://localhost:4000/route', {graph, source, target, algorithm})
  return res.data
}
