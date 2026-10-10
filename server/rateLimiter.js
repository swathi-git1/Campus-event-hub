// Server-side sliding-window rate limiter

const limits = {
  auth: { max: 15, windowMs: 60 * 1000 },           // 15 requests/minute for login/oauth/password-reset
  registration: { max: 10, windowMs: 60 * 1000 },   // 10 requests/minute for account registration
  od: { max: 25, windowMs: 60 * 1000 },             // 25 requests/minute for OD submissions & event enrollments
  search: { max: 80, windowMs: 60 * 1000 },         // 80 requests/minute for search endpoints
  assistant: { max: 30, windowMs: 60 * 1000 },      // 30 requests/minute for AI assistant
  api: { max: 150, windowMs: 60 * 1000 }            // 150 requests/minute for general API
}

const hits = new Map() // key -> Array<timestamp>

// Clean up stale hits every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, timestamps] of hits.entries()) {
    const valid = timestamps.filter(t => now - t < 120 * 1000)
    if (valid.length === 0) {
      hits.delete(key)
    } else {
      hits.set(key, valid)
    }
  }
}, 5 * 60 * 1000)

export function checkRateLimit(category = 'api', identifier = 'unknown') {
  const cfg = limits[category] || limits.api
  const key = `${category}:${identifier}`
  const now = Date.now()
  
  const timestamps = hits.get(key) || []
  const windowStart = now - cfg.windowMs
  const recentHits = timestamps.filter(t => t > windowStart)
  
  if (recentHits.length >= cfg.max) {
    const oldestHit = recentHits[0]
    const resetTime = Math.ceil((oldestHit + cfg.windowMs - now) / 1000)
    return {
      allowed: false,
      retryAfter: Math.max(1, resetTime),
      limit: cfg.max,
      remaining: 0
    }
  }
  
  recentHits.push(now)
  hits.set(key, recentHits)
  
  return {
    allowed: true,
    limit: cfg.max,
    remaining: cfg.max - recentHits.length,
    retryAfter: 0
  }
}
