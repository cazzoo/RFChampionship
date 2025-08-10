import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { adminOnly, supabaseAdminClient } from './middleware'
import sessions from './sessions'

// --- Middleware ---
const authMiddleware = (c, next) => jwt({ secret: process.env.JWT_SECRET! })(c, next)
const adminMiddleware = [authMiddleware, supabaseAdminClient, adminOnly]

// --- Hono Apps ---
export const championshipEvents = new Hono()
const events = new Hono()

// --- Nested Routes (/api/championships/:championshipId/events) ---
championshipEvents.get('/', async (c) => {
  const championshipId = c.req.param('championshipId')
  const supabase = c.get('supabase')
  const { data, error } = await supabase.from('events').select('*').eq('championship_id', championshipId)
  if (error) { return c.json({ error: error.message }, 500) }
  return c.json(data)
})

championshipEvents.post('/', ...adminMiddleware, async (c) => {
    const championshipId = c.req.param('championshipId')
    const newEvent = await c.req.json()
    const eventData = { ...newEvent, championship_id: parseInt(championshipId) }
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('events').insert(eventData).select().single()
    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data, 201)
})

// --- Top-level Routes (/api/events) ---
events.get('/:id', async (c) => {
    const { id } = c.req.param()
    const supabase = c.get('supabase')
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
    if (error) { return c.json({ error: 'Event not found' }, 404) }
    return c.json(data)
})

events.put('/:id', ...adminMiddleware, async (c) => {
    const { id } = c.req.param()
    const updatedEvent = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('events').update(updatedEvent).eq('id', id).select().single()
    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data)
})

events.delete('/:id', ...adminMiddleware, async (c) => {
    const { id } = c.req.param()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { error } = await supabaseAdmin.from('events').delete().eq('id', id)
    if (error) { return c.json({ error: error.message }, 500) }
    return c.body(null, 204)
})

// Nested route for sessions
events.route('/:eventId/sessions', sessions)

export default events
