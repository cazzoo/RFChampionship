import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { adminOnly, supabaseAdminClient } from './middleware'
import results from './results'

const sessions = new Hono()

// --- Middleware ---
const authMiddleware = (c, next) => jwt({ secret: process.env.JWT_SECRET! })(c, next)
const adminMiddleware = [authMiddleware, supabaseAdminClient, adminOnly]

// --- Routes (/api/sessions) ---
sessions.get('/', async (c) => {
  const { eventId } = c.req.query()
  const supabase = c.get('supabase')
  let query = supabase.from('sessions').select('*')
  if (eventId) { query = query.eq('event_id', eventId) }
  const { data, error } = await query
  if (error) { return c.json({ error: error.message }, 500) }
  return c.json(data)
})

sessions.get('/:id', async (c) => {
    const { id } = c.req.param()
    const supabase = c.get('supabase')
    const { data, error } = await supabase.from('sessions').select('*').eq('id', id).single()
    if (error) { return c.json({ error: 'Session not found' }, 404) }
    return c.json(data)
})

sessions.post('/', ...adminMiddleware, async (c) => {
    const newSession = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('sessions').insert(newSession).select().single()
    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data, 201)
})

sessions.put('/:id', ...adminMiddleware, async (c) => {
    const { id } = c.req.param()
    const updatedSession = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('sessions').update(updatedSession).eq('id', id).select().single()
    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data)
})

sessions.delete('/:id', ...adminMiddleware, async (c) => {
    const { id } = c.req.param()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { error } = await supabaseAdmin.from('sessions').delete().eq('id', id)
    if (error) { return c.json({ error: error.message }, 500) }
    return c.body(null, 204)
})

// Nested route for results
sessions.route('/:sessionId/results', results)

export default sessions
