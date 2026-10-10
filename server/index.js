import http from 'node:http'
import 'dotenv/config'
import { handleApiRequest } from './apiRouter.js'
import { initMongo, getMongoStatus } from './mongoConnection.js'

const PORT = process.env.PORT || 5000

const server = http.createServer(async (req, res) => {
  // CORS support for standalone backend access
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  // Health check endpoint
  if (req.url === '/health' || req.url === '/api/health') {
    const mongoStatus = await getMongoStatus()
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: mongoStatus
    }, null, 2))
    return
  }

  // Route API requests to router
  if (req.url && req.url.startsWith('/api')) {
    await handleApiRequest(req, res)
  } else {
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: `Not found: ${req.url}` }))
  }
})

server.listen(PORT, async () => {
  console.log(`=======================================================`)
  console.log(`  CAMPUS EVENT HUB - STANDALONE BACKEND SERVER`)
  console.log(`=======================================================`)
  console.log(`  Server listening on: http://localhost:${PORT}`)
  console.log(`  Health & DB status:  http://localhost:${PORT}/api/health`)
  console.log(`=======================================================`)
  await initMongo()
})
