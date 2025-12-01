import { NextResponse } from 'next/server'

export const runtime = 'edge'

const INFLUX_BASE = process.env.INFLUX_URL || process.env.INFLUX_HOST || 'http://localhost:8086'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { username, password } = body || {}
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing username or password' }, { status: 400 })
    }

    // For this demo we accept the specific Influx-backed test credential
    // username: user  password: 4444
    if (username !== 'user' || password !== '4444') {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    // Verify InfluxDB is reachable (health endpoint) - optional for development
    try {
      const healthRes = await fetch(`${INFLUX_BASE}/health`, { signal: AbortSignal.timeout(2000) })
      if (!healthRes.ok) {
        console.warn('InfluxDB health check failed, but allowing login in development mode')
      }
      const health = await healthRes.json().catch(() => ({}))
      if (health && health.status && health.status !== 'pass') {
        console.warn('InfluxDB reports unhealthy, but allowing login in development mode')
      }
    } catch (e) {
      console.warn('Failed to reach InfluxDB, but allowing login in development mode:', e)
      // Allow login to proceed even if InfluxDB is not available
    }

    // Issue a demo token (in a real app, mint a JWT or use Influx token)
    const token = `influx-dev-token-${Date.now()}`
    return NextResponse.json({ token, username })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
