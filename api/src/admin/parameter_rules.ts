import { Hono } from 'hono'

const rules = new Hono()

// POST / - Create a new parameter rule
rules.post('/', async (c) => {
    const newRule = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('parameter_rules').insert(newRule).select().single()
    if (error) {
        return c.json({ error: error.message }, 500)
    }
    return c.json(data, 201)
})

// GET / - List all parameter rules
rules.get('/', async (c) => {
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('parameter_rules').select('*')
    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data)
})

// PUT /:id - Update a parameter rule
rules.put('/:id', async (c) => {
    const { id } = c.req.param()
    const updatedRule = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('parameter_rules').update(updatedRule).eq('id', id).select().single()
    if (error) { return c.json({ error: error.message }, 500) }
    return c.json(data)
})

// DELETE /:id - Delete a parameter rule
rules.delete('/:id', async (c) => {
    const { id } = c.req.param()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { error } = await supabaseAdmin.from('parameter_rules').delete().eq('id', id)
    if (error) { return c.json({ error: error.message }, 500) }
    return c.body(null, 204)
})

export default rules
