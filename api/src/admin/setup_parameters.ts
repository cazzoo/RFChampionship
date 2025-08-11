import { Hono } from 'hono'

const parameters = new Hono()

// GET / - List all setup parameters
parameters.get('/', async (c) => {
  const supabaseAdmin = c.get('supabaseAdmin')
  const { data, error } = await supabaseAdmin.from('setup_parameters').select('*')
  if (error) {
    return c.json({ error: error.message }, 500)
  }
  return c.json(data)
})

// POST / - Create a new setup parameter
parameters.post('/', async (c) => {
    const newParam = await c.req.json()
    const supabaseAdmin = c.get('supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('setup_parameters').insert(newParam).select().single()
    if (error) {
        return c.json({ error: error.message }, 500)
    }
    return c.json(data, 201)
})

export default parameters
