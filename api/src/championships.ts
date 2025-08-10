import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { adminOnly, supabaseAdminClient } from './middleware'
import { championshipEvents } from './events'

const championships = new Hono()

// --- Middleware ---
const authMiddleware = (c, next) => jwt({ secret: process.env.JWT_SECRET! })(c, next)
const adminMiddleware = [authMiddleware, supabaseAdminClient, adminOnly]

// --- Public Routes ---
championships.get('/', async (c) => {
  const supabase = c.get('supabase')
  const { data, error } = await supabase.from('championships').select('*')
  if (error) { return c.json({ error: error.message }, 500) }
  return c.json(data)
})

championships.get('/:id', async (c) => {
  const supabase = c.get('supabase')
  const { id } = c.req.param()
  const { data, error } = await supabase.from('championships').select('*').eq('id', id).single()
  if (error) { return c.json({ error: 'Championship not found' }, 404) }
  return c.json(data)
})

// --- Authenticated User Routes ---
championships.post('/:id/register', authMiddleware, supabaseAdminClient, async (c) => {
    const championshipId = c.req.param('id')
    const payload = c.get('jwtPayload')
    const userId = payload.sub
    const newRegistration = { championship_id: parseInt(championshipId), user_id: userId }
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('registrations').insert(newRegistration).select().single()
    if (error) {
        if (error.code === '23505') { return c.json({ error: 'User is already registered' }, 409) }
        return c.json({ error: error.message }, 500)
    }
    return c.json(data, 201)
})

// --- Admin Protected Routes ---
championships.post('/', ...adminMiddleware, async (c) => {
    const newChamp = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('championships').insert(newChamp).select().single()
    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data, 201)
})

championships.put('/:id', ...adminMiddleware, async (c) => {
    const { id } = c.req.param()
    const updatedChamp = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('championships').update(updatedChamp).eq('id', id).select().single()
    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data)
})

championships.delete('/:id', ...adminMiddleware, async (c) => {
    const { id } = c.req.param()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { error } = await supabaseAdmin.from('championships').delete().eq('id', id)
    if (error) { return c.json({ error: error.message }, 500) }
    return c.body(null, 204)
})

// Nested route for events
championships.route('/:championshipId/events', championshipEvents)

export default championships
