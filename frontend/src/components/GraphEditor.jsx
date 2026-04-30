import React, {useState} from 'react'
import axios from 'axios'

export default function GraphEditor({graph, setGraph, positions, setPositions}){
  const [newNode, setNewNode] = useState('')
  const [fromNode, setFromNode] = useState('')
  const [toNode, setToNode] = useState('')
  const [edgeWeight, setEdgeWeight] = useState(1)

  function addNode(){
    const id = newNode.trim()
    if(!id) return alert('Enter node id')
    if(graph[id]) return alert('Node exists')
    setGraph(prev=> ({...prev, [id]: {}}))
    setPositions(prev=> ({...prev, [id]: {x: Math.floor(Math.random()*700)+80, y: Math.floor(Math.random()*260)+80}}))
    setNewNode('')
  }

  function deleteNode(id){
    const ng = {}
    for(const k of Object.keys(graph)){
      if(k===id) continue
      ng[k] = {...graph[k]}
      if(ng[k] && ng[k][id]) delete ng[k][id]
    }
    setGraph(ng)
    const np = {...positions}; delete np[id]; setPositions(np)
  }

  function addEdge(){
    if(!fromNode || !toNode) return alert('Select from/to')
    if(!graph[fromNode]) return alert('From node missing')
    setGraph(prev=> ({...prev, [fromNode]: {...prev[fromNode], [toNode]: Number(edgeWeight)}}))
    setEdgeWeight(1)
  }

  function updateEdge(from,to,w){
    setGraph(prev=> ({...prev, [from]: {...prev[from], [to]: Number(w)}}))
  }

  function removeEdge(from,to){
    setGraph(prev=>{
      const copy = {...prev, [from]: {...prev[from]}}
      delete copy[from][to]
      return copy
    })
  }

  function updatePos(id, x, y){
    setPositions(prev=>({...prev, [id]: {x: Number(x), y: Number(y)}}))
  }

  async function loadSample(){
    const res = await axios.get('http://localhost:4000/sample-graph')
    setGraph(res.data)
    // reset positions (will be auto-laid out by App)
    setPositions({})
  }

  return (
    <div className="mt-4 p-3 border rounded bg-white">
      <div className="font-semibold mb-2">Graph Editor</div>
      <div className="flex gap-2 mb-2">
        <input className="border p-1 flex-1" placeholder="New node id" value={newNode} onChange={e=>setNewNode(e.target.value)} />
        <button className="bg-indigo-600 text-white px-3 rounded" onClick={addNode}>Add Node</button>
        <button className="bg-gray-200 px-3 rounded" onClick={loadSample}>Load Sample</button>
      </div>

      <div className="mb-2">Nodes</div>
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(graph).map(n=> (
          <div key={n} className="p-2 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{n}</div>
              <div className="text-sm">x: <input className="border p-1 w-20" value={(positions[n] && positions[n].x) || ''} onChange={e=>updatePos(n, e.target.value, (positions[n] && positions[n].y) || 0)} /></div>
              <div className="text-sm">y: <input className="border p-1 w-20" value={(positions[n] && positions[n].y) || ''} onChange={e=>updatePos(n, (positions[n] && positions[n].x) || 0, e.target.value)} /></div>
            </div>
            <button className="text-sm text-red-600" onClick={()=>deleteNode(n)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="mt-3">Add Edge</div>
      <div className="flex gap-2 items-center">
        <select className="border p-1" value={fromNode} onChange={e=>setFromNode(e.target.value)}>
          <option value="">from</option>
          {Object.keys(graph).map(n=> <option key={n} value={n}>{n}</option>)}
        </select>
        <select className="border p-1" value={toNode} onChange={e=>setToNode(e.target.value)}>
          <option value="">to</option>
          {Object.keys(graph).map(n=> <option key={n} value={n}>{n}</option>)}
        </select>
        <input className="border p-1 w-20" type="number" value={edgeWeight} onChange={e=>setEdgeWeight(e.target.value)} />
        <button className="bg-indigo-600 text-white px-3 rounded" onClick={addEdge}>Add Edge</button>
      </div>

      <div className="mt-3">Edges</div>
      <div className="space-y-2">
        {Object.keys(graph).map(a=> (
          <div key={a} className="p-2 border rounded">
            <div className="font-medium">{a} →</div>
            <div className="flex gap-2 mt-1 flex-wrap">
              {Object.keys(graph[a]||{}).map(b=> (
                <div key={b} className="flex items-center gap-2 p-1 border rounded">
                  <div>{b}</div>
                  <input className="border p-1 w-20" type="number" value={graph[a][b]} onChange={e=>updateEdge(a,b,e.target.value)} />
                  <button className="text-red-600" onClick={()=>removeEdge(a,b)}>x</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
