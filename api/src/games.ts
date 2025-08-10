import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { adminOnly, supabaseAdminClient } from './middleware'

const games = new Hono()

// --- Middleware ---
const authMiddleware = (c, next) => jwt({ secret: process.env.JWT_SECRET! })(c, next)
const adminMiddleware = [authMiddleware, supabaseAdminClient, adminOnly]

// --- Public Routes ---
games.get('/', async (c) => {
  const supabase = c.get('supabase')
  const { data, error } = await supabase.from('games').select('*')
  if (error) { return c.json({ error: error.message }, 500) }
  return c.json(data)
})

games.get('/:id', async (c) => {
  const supabase = c.get('supabase')
  const { id } = c.req.param()
  const { data, error } = await supabase.from('games').select('*').eq('id', id).single()
  if (error) { return c.json({ error: 'Game not found' }, 404) }
  return c.json(data)
})

// --- Admin Protected Routes ---
games.post('/', ...adminMiddleware, async (c) => {
    const newGame = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('games').insert(newGame).select().single()
    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data, 201)
})

games.put('/:id', ...adminMiddleware, async (c) => {
    const { id } = c.req.param()
    const updatedGame = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('games').update(updatedGame).eq('id', id).select().single()
    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data)
})

games.delete('/:id', ...adminMiddleware, async (c) => {
    const { id } = c.req.param()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { error } = await supabaseAdmin.from('games').delete().eq('id', id)
    if (error) { return c.json({ error: error.message }, 500) }
    return c.body(null, 204)
})

export default games
