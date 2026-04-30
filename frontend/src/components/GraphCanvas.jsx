import React, {useRef, useEffect} from 'react'

function layoutNodes(keys, w=800,h=400){
  const n = keys.length
  const cx = w/2, cy = h/2, r = Math.min(w,h)/2 - 60
  const pos = {}
  keys.forEach((k,i)=>{
    const ang = (i / n) * Math.PI * 2
    pos[k] = {x: cx + Math.cos(ang)*r, y: cy + Math.sin(ang)*r}
  })
  return pos
}

export default function GraphCanvas({graph, result, source, target, speed, positions = {}, onNodeClick = ()=>{}}){
  const ref = useRef()

  useEffect(()=>{
    const canvas = ref.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = 900
    const h = canvas.height = 420
    ctx.clearRect(0,0,w,h)
    const keys = Object.keys(graph)
    if(!keys.length) return
    const baseLayout = layoutNodes(keys, w, h)
    const pos = {}
    keys.forEach(k=> pos[k] = (positions && positions[k]) ? positions[k] : baseLayout[k])

    // draw edges
    ctx.lineWidth = 2
    ctx.strokeStyle = '#ddd'
    for(const a of keys){
      for(const b of Object.keys(graph[a]||{})){
        ctx.beginPath(); ctx.moveTo(pos[a].x,pos[a].y); ctx.lineTo(pos[b].x,pos[b].y); ctx.stroke()
      }
    }

    const visited = new Set()
    const finalPath = (result && result.path) || []
    const animate = async ()=>{
      // animate visited nodes
      const visits = result && result.visitedOrder ? result.visitedOrder : []
      for(const v of visits){
        visited.add(v)
        drawAll()
        await new Promise(r=>setTimeout(r, speed))
      }
      // highlight final path
      drawAll(true)
    }

    function handleClick(e){
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY
      // find nearest node
      let nearest = null, best = Infinity
      for(const k of keys){
        const dx = x - pos[k].x, dy = y - pos[k].y
        const d = Math.hypot(dx,dy)
        if(d < best){ best = d; nearest = k }
      }
      if(best <= 30 && nearest) onNodeClick(nearest)
    }

    canvas.addEventListener('click', handleClick)

    function drawAll(highlightPath=false){
      ctx.clearRect(0,0,w,h)
      // edges
      for(const a of keys){
        for(const b of Object.keys(graph[a]||{})){
          ctx.beginPath(); ctx.moveTo(pos[a].x,pos[a].y); ctx.lineTo(pos[b].x,pos[b].y)
          ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.stroke()
          // label weight
          const mx = (pos[a].x+pos[b].x)/2, my = (pos[a].y+pos[b].y)/2
          ctx.fillStyle = '#333'; ctx.font = '12px sans-serif'; ctx.fillText(String(graph[a][b]), mx+4, my+4)
        }
      }
      // nodes
      for(const k of keys){
        ctx.beginPath(); ctx.arc(pos[k].x,pos[k].y,20,0,Math.PI*2)
        let fill = '#9CA3AF' // gray
        if(k===source) fill='#3B82F6'
        if(k===target) fill='#EF4444'
        if(visited.has(k)) fill='#FBBF24' // yellow
        ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle='#333'; ctx.stroke()
        ctx.fillStyle='#000'; ctx.font='14px sans-serif'; ctx.fillText(k, pos[k].x-6, pos[k].y+5)
      }
      if(highlightPath && finalPath.length>1){
        ctx.beginPath(); ctx.lineWidth = 5; ctx.strokeStyle = '#10B981'
        for(let i=0;i<finalPath.length-1;i++){
          const a = finalPath[i], b = finalPath[i+1]
          ctx.moveTo(pos[a].x,pos[a].y); ctx.lineTo(pos[b].x,pos[b].y)
        }
        ctx.stroke()
      }
    }

    animate()
    return ()=> canvas.removeEventListener('click', handleClick)
  }, [graph, result, source, target, speed, positions, onNodeClick])

  return <canvas ref={ref} style={{width:'100%',borderRadius:8}} />
}
