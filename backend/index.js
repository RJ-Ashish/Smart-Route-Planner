const express = require('express')
const cors = require('cors')
const path = require('path')

const routeRouter = require('./routes/route')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/route', routeRouter)

// Serve sample graph
app.get('/sample-graph', (req,res)=>{
  res.sendFile(path.join(__dirname, '../data/sampleGraph.json'))
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log(`Backend running on http://localhost:${PORT}`))
