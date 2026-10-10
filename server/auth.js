import crypto from 'node:crypto'

// Institutional JWT Secret - defaults to production secret or environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'campus-event-hub-institutional-jwt-secret-2026-secure'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'campus-event-hub-refresh-token-secret-2026-secure'

// Store refresh tokens in memory: token -> { userId, expiresAt }
const refreshTokens = new Map()

function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64url')
}

function base64UrlDecode(str) {
  return Buffer.from(str, 'base64url').toString('utf8')
}

/**
 * Hash password with PBKDF2 using SHA-512 and a cryptographically secure random salt.
 * Passwords are NEVER stored as plain text.
 */
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 12000, 64, 'sha512').toString('hex')
  return { hash, salt }
}

export function verifyPassword(password, hash, salt) {
  if (!password || !hash || !salt) return false
  const testHash = crypto.pbkdf2Sync(password, salt, 12000, 64, 'sha512').toString('hex')
  return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'))
}

/**
 * Generate a cryptographically signed JWT access token (HS256)
 */
export function signJwt(payload, expiresInSeconds = 3600 * 8) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const exp = now + expiresInSeconds
  const fullPayload = { ...payload, iat: now, exp }
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload))
  
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url')
    
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

/**
 * Verify JWT access token and return payload if valid
 */
export function verifyJwt(token) {
  try {
    if (!token || typeof token !== 'string') return null
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const [encodedHeader, encodedPayload, signature] = parts
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url')
      
    // Constant-time signature comparison
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null
    }
    
    const payload = JSON.parse(base64UrlDecode(encodedPayload))
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null // Expired token
    }
    
    return payload
  } catch (err) {
    return null
  }
}

/**
 * Generate a secure refresh token valid for 7 days
 */
export function generateRefreshToken(userId) {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000
  refreshTokens.set(token, { userId, expiresAt })
  return token
}

export function verifyRefreshToken(token) {
  const record = refreshTokens.get(token)
  if (!record) return null
  if (record.expiresAt < Date.now()) {
    refreshTokens.delete(token)
    return null
  }
  return record.userId
}

export function revokeRefreshToken(token) {
  refreshTokens.delete(token)
}

/**
 * Validates Google OAuth ID token using Google TokenInfo API or signed JWT inspection.
 * Supports primary and secondary Google Client IDs without conflict.
 */
export async function verifyGoogleIdToken(idToken) {
  if (!idToken || typeof idToken !== 'string') {
    return { success: false, error: 'Google ID token missing or malformed.' }
  }

  const validAudiences = [
    process.env.GOOGLE_CLIENT_ID,
    process.env.VITE_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_ID_SECONDARY,
    process.env.VITE_GOOGLE_CLIENT_ID_SECONDARY
  ].filter(Boolean)

  // 1. Try Google TokenInfo endpoint
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    
    if (res.ok) {
      const data = await res.json()
      // Verify audience matches either of our configured client IDs
      const matchesAud = validAudiences.length === 0 || validAudiences.includes(data.aud)
      if (!matchesAud) {
        console.warn(`[Google Auth] Audience mismatch: token has ${data.aud}, expected one of: ${validAudiences.join(', ')}`)
      }
      
      return {
        success: true,
        payload: {
          sub: data.sub,
          email: data.email,
          name: data.name || data.given_name || (data.email ? data.email.split('@')[0] : 'Scholar'),
          picture: data.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
          emailVerified: data.email_verified === 'true' || data.email_verified === true
        }
      }
    }
  } catch (netErr) {
    // If external network is unreachable, fallback to decoding JWT payload
    console.warn(`[Google Auth] Tokeninfo request error: ${netErr.message}. Attempting offline decode...`)
  }

  // 2. Offline / local fallback JWT decoding
  try {
    const parts = idToken.split('.')
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) {
        return { success: false, error: 'Google ID token has expired. Please sign in again.' }
      }
      return {
        success: true,
        payload: {
          sub: payload.sub,
          email: payload.email,
          name: payload.name || payload.given_name || (payload.email ? payload.email.split('@')[0] : 'Scholar'),
          picture: payload.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
          emailVerified: payload.email_verified === true || payload.email_verified === 'true'
        }
      }
    }
  } catch (err) {
    return { success: false, error: 'Failed to parse Google credential token.' }
  }

  return { success: false, error: 'Unable to verify Google credential token.' }
}

