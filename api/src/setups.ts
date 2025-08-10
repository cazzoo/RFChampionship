import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdminClient } from './middleware'

const setups = new Hono()

// --- Middleware ---
const authMiddleware = (c, next) => jwt({ secret: process.env.JWT_SECRET! })(c, next)

// All setup routes require authentication
setups.use('*', authMiddleware)

// --- Routes ---

// GET / - List setups for the authenticated user
setups.get('/', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
  const { data, error } = await supabase.from('setups').select('*')
  if (error) { return c.json({ error: error.message }, 500) }
  return c.json(data)
})

// POST / - Create a new setup for the authenticated user
setups.post('/', supabaseAdminClient, async (c) => {
    const payload = c.get('jwtPayload')
    const userId = payload.sub
    const newSetup = await c.req.json()
    const setupData = { ...newSetup, user_id: userId, version: 1 }
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('setups').insert(setupData).select().single()
    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data, 201)
})

// PUT /:id - Creates a new version of a setup
setups.put('/:id', supabaseAdminClient, async (c) => {
    const { id } = c.req.param()
    const payload = c.get('jwtPayload')
    const userId = payload.sub
    const updatedSetupData = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')

    const { data: originalSetup, error: fetchError } = await supabaseAdmin
        .from('setups')
        .select('*')
        .eq('id', id)
        .single()

    if (fetchError) return c.json({ error: 'Original setup not found' }, 404)
    if (originalSetup.user_id !== userId) return c.json({ error: 'Forbidden' }, 403)

    const newVersionData = {
        ...originalSetup,
        ...updatedSetupData,
        id: undefined,
        user_id: userId,
        version: originalSetup.version + 1,
        parent_setup_id: originalSetup.id,
    }

    const { data: newVersion, error: insertError } = await supabaseAdmin
        .from('setups')
        .insert(newVersionData)
        .select()
        .single()

    if (insertError) return c.json({ error: insertError.message }, 500)

    return c.json(newVersion)
})

// GET /:id/history - Get all versions of a setup
setups.get('/:id/history', supabaseAdminClient, async (c) => {
    const { id } = c.req.param()
    const payload = c.get('jwtPayload')
    const userId = payload.sub
    const supabaseAdmin = c.get('supabaseAdmin')

    // 1. Fetch the setup to start from
    let { data: currentSetup, error: fetchError } = await supabaseAdmin.from('setups').select('*').eq('id', id).single()
    if (fetchError) return c.json({ error: 'Not found' }, 404)

    // 2. Security check: make sure user owns at least this one setup in the chain
    if (currentSetup.user_id !== userId) return c.json({ error: 'Forbidden' }, 403)

    // 3. Go up to find the root
    let root = currentSetup;
    while (root.parent_setup_id !== null) {
        const { data: parent } = await supabaseAdmin.from('setups').select('*').eq('id', root.parent_setup_id).single()
        if (!parent) break; // Should not happen in consistent data
        root = parent;
    }

    // 4. Go down from the root to find all descendants
    const history = [root]
    const queue = [root]
    while(queue.length > 0) {
        const current = queue.shift()
        const { data: children } = await supabaseAdmin.from('setups').select('*').eq('parent_setup_id', current.id)
        if (children) {
            for (const child of children) {
                history.push(child)
                queue.push(child)
            }
        }
    }

    return c.json(history)
})

// POST /:id/share - Make a setup public or private
setups.post('/:id/share', supabaseAdminClient, async (c) => {
    const { id } = c.req.param()
    const payload = c.get('jwtPayload')
    const userId = payload.sub
    const { public: isPublic } = await c.req.json()

    const supabaseAdmin = c.get('supabaseAdmin')

    // Check for ownership first
    const { data: setup, error: fetchError } = await supabaseAdmin.from('setups').select('user_id').eq('id', id).single()
    if (fetchError) return c.json({ error: 'Not found' }, 404)
    if (setup.user_id !== userId) return c.json({ error: 'Forbidden' }, 403)

    // Update the is_public flag
    const { data: updatedSetup, error: updateError } = await supabaseAdmin
        .from('setups')
        .update({ is_public: isPublic })
        .eq('id', id)
        .select()
        .single()

    if (updateError) return c.json({ error: updateError.message }, 500)
    return c.json(updatedSetup)
})

// POST /:id/copy - Copy a public setup to the user's account
setups.post('/:id/copy', supabaseAdminClient, async (c) => {
    const { id } = c.req.param()
    const payload = c.get('jwtPayload')
    const userId = payload.sub
    const supabaseAdmin = c.get('supabaseAdmin')

    // 1. Get the setup to copy
    const { data: originalSetup, error: fetchError } = await supabaseAdmin.from('setups').select('*').eq('id', id).single()
    if (fetchError) return c.json({ error: 'Setup not found' }, 404)
    if (!originalSetup.is_public) return c.json({ error: 'Cannot copy a private setup' }, 403)

    // 2. Create the copy
    const newSetupData = {
        ...originalSetup,
        id: undefined,
        user_id: userId,
        is_public: false,
        is_template: false,
        version: 1,
        parent_setup_id: null,
    }

    const { data: copiedSetup, error: insertError } = await supabaseAdmin.from('setups').insert(newSetupData).select().single()
    if (insertError) return c.json({ error: insertError.message }, 500)

    return c.json(copiedSetup, 201)
})

export default setups
