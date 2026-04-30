import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import GraphCanvas from './components/GraphCanvas'
import GraphEditor from './components/GraphEditor'

export default function App(){
  const [graph, setGraph] = useState({})
  const [source, setSource] = useState('A')
  const [target, setTarget] = useState('F')
  const [algo, setAlgo] = useState('dijkstra')
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(300)
  const [positions, setPositions] = useState({})
  const [clickMode, setClickMode] = useState('source')

  function layoutNodes(keys, w=900, h=420){
    const n = keys.length || 1
    const cx = w/2, cy = h/2, r = Math.min(w,h)/2 - 80
    const pos = {}
    keys.forEach((k,i)=>{
      const ang = (i / n) * Math.PI * 2
      pos[k] = {x: cx + Math.cos(ang)*r, y: cy + Math.sin(ang)*r}
    })
    return pos
  }

  useEffect(()=>{ axios.get('https://smart-route-planner-2rsv.onrender.com/sample-graph').then(r=>setGraph(r.data)) },[])

  // ensure positions and default source/target when graph changes
  useEffect(()=>{
    const keys = Object.keys(graph)
    if(!keys.length) return
    // set defaults
    if(!keys.includes(source)) setSource(keys[0])
    if(!keys.includes(target)) setTarget(keys[keys.length-1])
    // compute layout for any missing positions
    setPositions(prev => {
      const layout = layoutNodes(keys)
      const out = {...prev}
      let changed = false
      keys.forEach(k=>{
        if(!out[k]){ out[k] = layout[k]; changed = true }
      })
      return out
    })
  },[graph])

  async function run(){
    setRunning(true)
    setResult(null)
    try{
      const res = await axios.post('https://smart-route-planner-2rsv.onrender.com/route', { graph, source, target, algorithm: algo, positions })
      setResult(res.data)
    }catch(e){ alert(e.response?.data?.error || e.message) }
    setRunning(false)
  }

  function runAll(){
    // Run all three algorithms and show comparison
    Promise.all(['dijkstra','astar','greedy'].map(a=> axios.post('https://smart-route-planner-2rsv.onrender.com/route', {graph, source, target, algorithm: a, positions}).then(r=>({algorithm:a, ...r.data})).catch(e=>({algorithm:a,error:e.message}))))
    .then(setResult)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Smart Route Planner</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <div className="mb-2">Source</div>
          <select className="border p-2 w-full" value={source} onChange={e=>setSource(e.target.value)}>
            {Object.keys(graph).map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
          <div className="mt-2">Target</div>
          <select className="border p-2 w-full" value={target} onChange={e=>setTarget(e.target.value)}>
            {Object.keys(graph).map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
          <div className="mt-4 controls">
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={run} disabled={running}>Run {algo}</button>
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={runAll}>Compare All</button>
          </div>
          <div className="mt-2">Algorithm</div>
          <select className="border p-2 w-full" value={algo} onChange={e=>setAlgo(e.target.value)}>
            <option value="dijkstra">Dijkstra</option>
            <option value="astar">A*</option>
            <option value="greedy">Greedy</option>
          </select>
          <div className="mt-4">Speed</div>
          <input type="range" min="50" max="1000" value={speed} onChange={e=>setSpeed(e.target.value)} />
        </div>
        <div className="col-span-2">
          <div className="canvas-wrap">
            <div className="mb-2 flex items-center gap-2">
              <div className="text-sm">Click mode:</div>
              <button className={`px-2 py-1 rounded ${clickMode==='source' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={()=>setClickMode('source')}>Set Source</button>
              <button className={`px-2 py-1 rounded ${clickMode==='target' ? 'bg-red-600 text-white' : 'bg-gray-200'}`} onClick={()=>setClickMode('target')}>Set Target</button>
              <div className="text-xs text-gray-500 ml-3">Click a node on the canvas to set {clickMode}</div>
            </div>
            <GraphCanvas graph={graph} result={result} source={source} target={target} speed={speed} positions={positions} onNodeClick={(n)=>{ if(clickMode==='source') setSource(n); else setTarget(n) }} />
          </div>
          <GraphEditor graph={graph} setGraph={setGraph} positions={positions} setPositions={setPositions} />
          <div className="mt-4">
            <pre className="bg-gray-50 p-2 rounded max-h-56 overflow-auto">
              {Array.isArray(result) ? JSON.stringify(result, null, 2) : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
