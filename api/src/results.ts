import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { adminOnly, supabaseAdminClient } from './middleware'

const results = new Hono()

// --- Middleware ---
const authMiddleware = (c, next) => jwt({ secret: process.env.JWT_SECRET! })(c, next)
const adminMiddleware = [authMiddleware, supabaseAdminClient, adminOnly]

// --- Routes ---

// POST / - Bulk-add results for a session
results.post('/', ...adminMiddleware, async (c) => {
    const sessionId = c.req.param('sessionId')
    const resultsPayload = await c.req.json()

    if (!Array.isArray(resultsPayload)) {
        return c.json({ error: 'Request body must be an array of results' }, 400)
    }

    const resultsWithSessionId = resultsPayload.map(result => ({
        ...result,
        session_id: parseInt(sessionId)
    }))

    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('results').insert(resultsWithSessionId).select()

    if (error) {
        return c.json({ error: error.message }, 500)
    }
    return c.json(data, 201)
})

export default results
